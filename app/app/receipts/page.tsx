import Link from "next/link";
import { ArrowRight, ReceiptText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fmtDate } from "@/lib/dates";
import { formatCents } from "@/lib/format";

export const dynamic = "force-dynamic";

type ReceiptRow = {
  id: string;
  merchant: string | null;
  order_date: string;
  total_cents: number;
  currency: string;
  created_at: string;
  purchases: { count: number }[] | null;
};

export default async function ReceiptsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("receipts")
    .select(
      "id, merchant, order_date, total_cents, currency, created_at, purchases(count)",
    )
    .order("order_date", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as ReceiptRow[];

  const totalSpent = rows.reduce((sum, r) => sum + r.total_cents, 0);

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Receipts
          </h1>
          <p className="mt-1 text-sm text-muted">
            Each scanned receipt and its line items. Tap one to see what you
            bought.
          </p>
        </div>
        {rows.length > 0 ? (
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Lifetime total
            </div>
            <div className="mt-0.5 font-mono text-xl font-medium tabular-nums">
              {formatCents(totalSpent, rows[0]?.currency ?? "USD")}
            </div>
          </div>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <div className="card p-12 text-center">
          <ReceiptText className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 text-sm text-muted">
            No receipts yet. Scan one from{" "}
            <Link
              href="/app/purchases/new"
              className="text-accent transition-colors hover:text-ink"
            >
              Add purchase
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {rows.map((r) => {
            const itemCount = r.purchases?.[0]?.count ?? 0;
            return (
              <Link
                key={r.id}
                href={`/app/receipts/${r.id}`}
                className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-bg/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent">
                    <ReceiptText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {r.merchant ?? "Unknown merchant"}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
                      {fmtDate(r.order_date)} · {itemCount} item
                      {itemCount === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium tabular-nums">
                    {formatCents(r.total_cents, r.currency)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
