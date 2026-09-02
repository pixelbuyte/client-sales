import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatCard } from "@/components/StatCard";
import { STAGE_LABELS, STAGE_ORDER, type ShopStage } from "@/lib/shops";
import { formatCents } from "@/lib/format";
import { fmtDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function TrackerDashboard() {
  const admin = createAdminClient();
  const { data: shops } = await admin
    .from("shops")
    .select("id, business_name, stage, created_at")
    .order("created_at", { ascending: false });

  const rows = shops ?? [];
  const counts = new Map<ShopStage, number>();
  for (const stage of STAGE_ORDER) counts.set(stage, 0);
  for (const s of rows) counts.set(s.stage as ShopStage, (counts.get(s.stage as ShopStage) ?? 0) + 1);

  const liveCount = counts.get("subscription_active") ?? 0;
  const mrr = liveCount * 75000; // $750/mo in cents

  return (
    <>
      <div className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Overview
        </div>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          Tracker
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total shops" value={rows.length} />
        <StatCard label="Paid setup" value={counts.get("paid") ?? 0} sub="awaiting go-live" />
        <StatCard label="Subscriptions active" value={liveCount} />
        <StatCard label="MRR" value={formatCents(mrr)} sub={`${liveCount} × $750/mo`} />
      </div>

      <div className="mt-6 card p-6">
        <h2 className="font-display text-base font-semibold">Pipeline</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {STAGE_ORDER.map((stage) => (
            <div key={stage} className="rounded-md border border-border bg-bg p-3 text-center">
              <div className="font-mono text-2xl font-medium">{counts.get(stage) ?? 0}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted">
                {STAGE_LABELS[stage]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Recent shops</h2>
          <Link
            href="/app/shops"
            className="font-mono text-[10px] uppercase tracking-widest text-accent hover:text-ink"
          >
            All →
          </Link>
        </div>
        {rows.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            No shops yet.{" "}
            <Link href="/app/shops/new" className="text-accent hover:underline">
              Add one
            </Link>{" "}
            or{" "}
            <Link href="/app/shops/import" className="text-accent hover:underline">
              import a CSV
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {rows.slice(0, 8).map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                <Link href={`/app/shops/${s.id}`} className="truncate hover:text-accent">
                  {s.business_name}
                </Link>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>{STAGE_LABELS[s.stage as ShopStage]}</span>
                  <span className="font-mono">{fmtDate(s.created_at)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
