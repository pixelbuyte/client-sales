import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fmtDate } from "@/lib/dates";
import { formatCents } from "@/lib/format";

export const dynamic = "force-dynamic";

type Item = {
  id: string;
  item_name: string;
  price_cents: number;
  currency: string;
  quantity: number;
  category: { name: string; color: string }[] | { name: string; color: string } | null;
};

export default async function ReceiptDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: receipt } = await supabase
    .from("receipts")
    .select("id, merchant, order_date, total_cents, currency, receipt_path, created_at")
    .eq("id", params.id)
    .single();

  if (!receipt) notFound();

  const { data: items } = await supabase
    .from("purchases")
    .select("id, item_name, price_cents, currency, quantity, category:categories(name, color)")
    .eq("receipt_id", params.id)
    .order("price_cents", { ascending: false });

  let receiptUrl: string | null = null;
  if (receipt.receipt_path) {
    const { data: signed } = await supabase.storage
      .from("receipts")
      .createSignedUrl(receipt.receipt_path, 60 * 60);
    receiptUrl = signed?.signedUrl ?? null;
  }

  const rows = (items ?? []) as Item[];
  const itemCount = rows.reduce((sum, r) => sum + r.quantity, 0);
  const currency = receipt.currency ?? "USD";

  return (
    <>
      <Link
        href="/app/receipts"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> All receipts
      </Link>

      <div className="card mb-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {receipt.merchant ?? "Unknown merchant"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {fmtDate(receipt.order_date)} · {itemCount} item{itemCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-muted">Total</div>
            <div className="text-2xl font-semibold tabular-nums">
              {formatCents(receipt.total_cents, currency)}
            </div>
            {receiptUrl ? (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs text-accent"
              >
                View receipt image
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-border px-5 py-3 text-sm font-medium">Items</div>
        {rows.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted">
            No items linked to this receipt.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((it) => {
              const cat = Array.isArray(it.category) ? it.category[0] ?? null : it.category;
              return (
                <li key={it.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-muted">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{it.item_name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      {it.quantity > 1 ? <span>Qty {it.quantity}</span> : null}
                      {cat ? (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5"
                          style={{ color: cat.color }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-ink">{cat.name}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="text-sm font-medium">
                      {formatCents(it.price_cents * it.quantity, it.currency)}
                    </div>
                    {it.quantity > 1 ? (
                      <div className="text-xs text-muted">
                        {formatCents(it.price_cents, it.currency)} ea
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
