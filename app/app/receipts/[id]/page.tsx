import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductThumb } from "@/components/ProductThumb";
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
  image_url: string | null;
  category:
    | { name: string; color: string }[]
    | { name: string; color: string }
    | null;
};

export default async function ReceiptDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: receipt } = await supabase
    .from("receipts")
    .select(
      "id, merchant, order_date, total_cents, currency, receipt_path, created_at",
    )
    .eq("id", params.id)
    .single();

  if (!receipt) notFound();

  const { data: items } = await supabase
    .from("purchases")
    .select(
      "id, item_name, price_cents, currency, quantity, image_url, category:categories(name, color)",
    )
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
  const mostExpensive = rows[0] ?? null;

  return (
    <>
      <Link
        href="/app/receipts"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> All receipts
      </Link>

      {/* Receipt-style header card */}
      <div className="card mb-6 overflow-hidden">
        {/* Top "tear" strip */}
        <div className="flex gap-1 bg-accent-50 px-5 py-2">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full bg-accent/30" />
          ))}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Receipt
              </div>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
                {receipt.merchant ?? "Unknown merchant"}
              </h1>
              <p className="mt-1 font-mono text-xs text-muted">
                {fmtDate(receipt.order_date)} · {itemCount} item
                {itemCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Total
              </div>
              <div className="mt-1 font-mono text-3xl font-medium tabular-nums text-ink">
                {formatCents(receipt.total_cents, currency)}
              </div>
              {receiptUrl ? (
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block font-mono text-[10px] uppercase tracking-widest text-accent transition-colors hover:text-ink"
                >
                  View image →
                </a>
              ) : null}
            </div>
          </div>

          {mostExpensive ? (
            <div className="mt-5 border-t border-dashed border-border pt-4 text-xs text-muted">
              <span className="font-mono uppercase tracking-widest">
                Biggest line:
              </span>{" "}
              <span className="text-ink">{mostExpensive.item_name}</span> ·{" "}
              <span className="font-mono tabular-nums">
                {formatCents(
                  mostExpensive.price_cents * mostExpensive.quantity,
                  mostExpensive.currency,
                )}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Items list */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-bg/40 px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Items ({rows.length})
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Line total
          </span>
        </div>

        {rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted">
            No items linked to this receipt.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((it) => {
              const cat = Array.isArray(it.category)
                ? it.category[0] ?? null
                : it.category;
              return (
                <li
                  key={it.id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-bg/40"
                >
                  <ProductThumb
                    imageUrl={it.image_url}
                    color={cat?.color}
                    name={it.item_name}
                    merchant={receipt.merchant}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{it.item_name}</div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                      {it.quantity > 1 ? <span>Qty {it.quantity}</span> : null}
                      {cat ? (
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                          style={{
                            backgroundColor: cat.color + "18",
                            color: cat.color,
                          }}
                        >
                          <span
                            className="h-1 w-1 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-medium tabular-nums">
                      {formatCents(it.price_cents * it.quantity, it.currency)}
                    </div>
                    {it.quantity > 1 ? (
                      <div className="font-mono text-[10px] text-muted">
                        {formatCents(it.price_cents, it.currency)} ea
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Receipt footer */}
        {rows.length > 0 ? (
          <div className="border-t border-dashed border-border bg-bg/40 px-5 py-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Subtotal · {itemCount} item{itemCount === 1 ? "" : "s"}
              </span>
              <span className="font-mono text-sm font-medium tabular-nums">
                {formatCents(receipt.total_cents, currency)}
              </span>
            </div>
          </div>
        ) : null}

        {/* Bottom "tear" serration */}
        <div className="flex gap-1 px-5 py-2">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full bg-border" />
          ))}
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
        Product photos · matched automatically when possible
      </p>
    </>
  );
}
