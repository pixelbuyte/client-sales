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
    .select("id, merchant, order_date, total_cents, currency, created_at, purchases(count)")
    .order("order_date", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as ReceiptRow[];

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Receipts</h1>
          <p className="text-sm text-muted">
            Each scanned receipt and its line items. Tap one to see what you bought.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center">
          <ReceiptText className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 text-sm text-muted">
            No receipts yet. Scan one from{" "}
            <Link href="/app/purchases/new" className="text-accent">Add purchase</Link>.
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-border">
          {rows.map((r) => {
            const itemCount = r.purchases?.[0]?.count ?? 0;
            return (
              <Link
                key={r.id}
                href={`/app/receipts/${r.id}`}
                className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-accent-50/40"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.merchant ?? "Unknown merchant"}</div>
                  <div className="text-xs text-muted">
                    {fmtDate(r.order_date)} · {itemCount} item{itemCount === 1 ? "" : "s"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium tabular-nums">
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
