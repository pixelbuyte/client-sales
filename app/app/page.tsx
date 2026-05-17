import Link from "next/link";
import { ProductThumb } from "@/components/ProductThumb";
import { Mic, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/StatCard";
import { DeadlineChip } from "@/components/DeadlineChip";
import { EmptyState } from "@/components/EmptyState";
import { SpendBarChart } from "@/components/SpendBarChart";
import { CategoryDonut } from "@/components/CategoryDonut";
import { addDaysISO, daysUntil, fmtDate, todayISO } from "@/lib/dates";
import { formatCents } from "@/lib/format";

export const dynamic = "force-dynamic";

type Purchase = {
  id: string;
  item_name: string;
  merchant: string | null;
  order_date: string;
  price_cents: number;
  currency: string;
  return_deadline: string | null;
  warranty_end: string | null;
  image_url: string | null;
};

export default async function DashboardPage() {
  const supabase = createClient();
  const today = todayISO();
  const returnsHorizon = addDaysISO(today, 14);
  const warrantyHorizon = addDaysISO(today, 30);
  // First day of the oldest month shown on the 6-month bar chart. Pegging
  // this to a real month boundary avoids the off-by-a-few-days drift you'd
  // get from `addDaysISO(today, -150)`, which silently drops purchases from
  // the early days of the oldest month.
  const [yStr, mStr] = today.split("-");
  const chartStartYear = Number(yStr);
  const chartStartMonth = Number(mStr) - 5;
  const chartStartDate = new Date(Date.UTC(chartStartYear, chartStartMonth - 1, 1));
  const chartStart = `${chartStartDate.getUTCFullYear()}-${String(chartStartDate.getUTCMonth() + 1).padStart(2, "0")}-01`;
  // Week starts Monday. addDaysISO with a negative offset gives us the
  // Monday of the current ISO week regardless of runtime timezone.
  const [tY, tM, tD] = today.split("-").map(Number);
  const todayDow = new Date(Date.UTC(tY, tM - 1, tD)).getUTCDay();
  const mondayOffset = todayDow === 0 ? -6 : 1 - todayDow;
  const weekStart = addDaysISO(today, mondayOffset);

  const [
    { count: total },
    { data: returns },
    { data: warranties },
    { data: monthRows },
    { data: chartRows },
  ] = await Promise.all([
    supabase.from("purchases").select("id", { count: "exact", head: true }),
    supabase
      .from("purchases")
      .select("id, item_name, merchant, order_date, price_cents, currency, return_deadline, warranty_end, image_url")
      .gte("return_deadline", today)
      .lte("return_deadline", returnsHorizon)
      .order("return_deadline", { ascending: true })
      .limit(5),
    supabase
      .from("purchases")
      .select("id, item_name, merchant, order_date, price_cents, currency, return_deadline, warranty_end, image_url")
      .gte("warranty_end", today)
      .lte("warranty_end", warrantyHorizon)
      .order("warranty_end", { ascending: true })
      .limit(5),
    supabase
      .from("purchases")
      .select("price_cents")
      .gte("order_date", today.slice(0, 7) + "-01"),
    supabase
      .from("purchases")
      .select("price_cents, order_date, category:categories(name, color)")
      .gte("order_date", chartStart),
  ]);

  const { data: merchantRows } = await supabase
    .from("purchases")
    .select("merchant, price_cents")
    .gte("order_date", chartStart);

  const { data: weekRows } = await supabase
    .from("purchases")
    .select("merchant, price_cents")
    .gte("order_date", weekStart);

  // NOTE: dashboard aggregations sum price_cents only and ignore
  // `quantity` until we audit legacy rows where price_cents may have been
  // stored as the line total (#12). Once verified, switch back to
  // `price_cents * quantity` to avoid undercounting multi-quantity rows.
  const monthSpend = (monthRows ?? []).reduce(
    (sum, r: { price_cents: number }) => sum + r.price_cents,
    0,
  );

  if ((total ?? 0) === 0) {
    return (
      <>
        <Header />
        <EmptyState />
      </>
    );
  }

  const spendByMonth = bucketByMonth(today, (chartRows ?? []) as ChartRow[]);
  const byCategory = bucketByCategory((chartRows ?? []) as ChartRow[]);
  const byMerchant = bucketByMerchant(
    (merchantRows ?? []) as { merchant: string | null; price_cents: number }[],
  );
  const weekRowsSafe = (weekRows ?? []) as { merchant: string | null; price_cents: number }[];
  const weekSpend = weekRowsSafe.reduce((sum, r) => sum + r.price_cents, 0);
  const byMerchantWeek = bucketByMerchant(weekRowsSafe);

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Returns closing soon"
          value={(returns ?? []).length}
          sub="next 14 days"
        >
          {(returns ?? []).slice(0, 3).map((p: Purchase) => (
            <Row key={p.id} title={p.item_name} sub={p.merchant} days={daysUntil(p.return_deadline)} imageUrl={p.image_url} />
          ))}
        </StatCard>
        <StatCard
          label="Warranties ending"
          value={(warranties ?? []).length}
          sub="next 30 days"
        >
          {(warranties ?? []).slice(0, 3).map((p: Purchase) => (
            <Row key={p.id} title={p.item_name} sub={p.merchant} days={daysUntil(p.warranty_end)} imageUrl={p.image_url} />
          ))}
        </StatCard>
        <StatCard
          label="This week"
          value={formatCents(weekSpend)}
          sub={`${weekRowsSafe.length} purchase${weekRowsSafe.length === 1 ? "" : "s"} since Mon`}
        />
        <StatCard
          label="This month"
          value={formatCents(monthSpend)}
          sub={`${(monthRows ?? []).length} purchases`}
        />
      </div>

      <div className="mt-6">
        <SpendBarChart data={spendByMonth} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <CategoryDonut data={byCategory} />
        <MerchantBreakdown
          data={byMerchant}
          title="Spend by merchant"
          subtitle="Last 6 months"
        />
      </div>

      <div className="mt-6">
        <MerchantBreakdown
          data={byMerchantWeek}
          title="Spend by merchant — this week"
          subtitle="Since Monday"
          emptyLabel="No spend this week yet."
        />
      </div>

      <ComingSoon />
    </>
  );
}

function MerchantBreakdown({
  data,
  title,
  subtitle,
  emptyLabel,
}: {
  data: { merchant: string; cents: number }[];
  title: string;
  subtitle: string;
  emptyLabel?: string;
}) {
  const top = data.slice(0, 6);
  const max = top[0]?.cents ?? 0;
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        <Link
          href="/app/receipts"
          className="font-mono text-[10px] uppercase tracking-widest text-accent transition-colors hover:text-ink"
        >
          All →
        </Link>
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
        {subtitle}
      </p>
      {top.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          {emptyLabel ?? "No merchant data yet."}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {top.map((m) => (
            <li key={m.merchant} className="text-sm">
              <div className="flex items-center justify-between">
                <span className="truncate">{m.merchant}</span>
                <span className="font-mono tabular-nums text-muted">
                  {formatCents(m.cents)}
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-border/60">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{
                    width: max > 0 ? `${(m.cents / max) * 100}%` : "0%",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ComingSoon() {
  const cards: { icon: typeof Mic; title: string; desc: string }[] = [
    {
      icon: Store,
      title: "Financial advisor",
      desc: "A monthly review trained on your spending — concrete suggestions on where to cut, plus warnings before recurring charges grow.",
    },
    {
      icon: Mic,
      title: "Voice check-in",
      desc: "Talk through your week or month — once every week or two — with a coach trained on your purchase history.",
    },
  ];
  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="font-display text-base font-semibold">Coming soon</h2>
        <div className="h-px flex-1 bg-border" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Roadmap
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <div
            key={c.title}
            className="card relative overflow-hidden p-5 opacity-90 transition-opacity hover:opacity-100"
          >
            <span className="absolute right-3 top-3 rounded-full bg-accent-50 px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-widest text-accent">
              Soon
            </span>
            <c.icon className="h-5 w-5 text-accent" />
            <h3 className="mt-3 font-display text-sm font-semibold">
              {c.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function bucketByMerchant(rows: { merchant: string | null; price_cents: number }[]) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = r.merchant?.trim() || "Unknown";
    map.set(key, (map.get(key) ?? 0) + r.price_cents);
  }
  return [...map.entries()]
    .map(([merchant, cents]) => ({ merchant, cents }))
    .sort((a, b) => b.cents - a.cents);
}

type ChartRow = {
  price_cents: number;
  order_date: string;
  category: { name: string; color: string }[] | { name: string; color: string } | null;
};

function bucketByMonth(today: string, rows: ChartRow[]) {
  const months: { month: string; key: string; cents: number }[] = [];
  const [yStr, mStr] = today.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(y, m - 1 - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    months.push({ month: label, key, cents: 0 });
  }
  for (const r of rows) {
    const key = r.order_date.slice(0, 7);
    const slot = months.find((mm) => mm.key === key);
    if (slot) slot.cents += r.price_cents;
  }
  return months.map(({ month, cents }) => ({ month, cents }));
}

function bucketByCategory(rows: ChartRow[]) {
  const map = new Map<string, { name: string; color: string; cents: number }>();
  for (const r of rows) {
    const cat = Array.isArray(r.category) ? r.category[0] ?? null : r.category;
    const name = cat?.name ?? "Uncategorized";
    const color = cat?.color ?? "#6B7280";
    const cur = map.get(name) ?? { name, color, cents: 0 };
    cur.cents += r.price_cents;
    map.set(name, cur);
  }
  return [...map.values()].sort((a, b) => b.cents - a.cents);
}

function Header() {
  return (
    <div className="mb-6">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
        Overview
      </div>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
        Dashboard
      </h1>
      <p className="mt-1 font-mono text-xs text-muted">{fmtDate(todayISO())}</p>
    </div>
  );
}

function Row({
  title,
  sub,
  days,
  imageUrl,
}: {
  title: string;
  sub: string | null;
  days: number | null;
  imageUrl?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <div className="flex min-w-0 items-center gap-2">
        {imageUrl || brandFromMerchant(sub) ? (
          <ProductThumb
            imageUrl={imageUrl ?? null}
            name={title}
            merchant={sub}
            size="sm"
          />
        ) : null}
        <div className="min-w-0">
          <div className="truncate">{title}</div>
          {sub ? <div className="truncate text-xs text-muted">{sub}</div> : null}
        </div>
      </div>
      <DeadlineChip days={days} />
    </div>
  );
}
