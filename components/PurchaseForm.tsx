"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Trash2, Plus } from "lucide-react";
import { ProductThumb } from "@/components/ProductThumb";
import { createPurchase, createReceipt } from "@/app/app/purchases/actions";
import { addDaysISO, todayISO } from "@/lib/dates";

type Category = { id: string; name: string };
type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "CAD", "AUD"];

type ScannedItem = {
  name: string;
  price: string;
  quantity: string;
  image_url: string | null;
};

export function PurchaseForm({
  categories,
  ocrEnabled,
}: {
  categories: Category[];
  ocrEnabled: boolean;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [itemName, setItemName] = useState("");
  const [merchant, setMerchant] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [orderDate, setOrderDate] = useState(todayISO());
  const [returnDeadline, setReturnDeadline] = useState(() => addDaysISO(todayISO(), 30));
  const [warrantyEnd, setWarrantyEnd] = useState(() => addDaysISO(todayISO(), 365));
  const [categoryId, setCategoryId] = useState("");

  const [hasReceipt, setHasReceipt] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanFilled, setScanFilled] = useState(false);
  const receiptRef = useRef<HTMLInputElement | null>(null);

  // Multi-item flow: when a scan returns >1 line item, we hide the single
  // purchase form and show an editable list of items the user confirms
  // before we create one receipt + N purchases.
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);

  function onOrderDateChange(next: string) {
    setOrderDate(next);
    if (!next) return;
    setReturnDeadline(addDaysISO(next, 30));
    setWarrantyEnd(addDaysISO(next, 365));
  }

  async function onScan() {
    const file = receiptRef.current?.files?.[0];
    if (!file) return;
    setScanning(true);
    setScanError(null);
    setScanFilled(false);
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      const res = await fetch("/api/ocr", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? `Scan failed (${res.status})`);

      if (body.merchant) setMerchant(body.merchant);
      if (body.currency && CURRENCIES.includes(body.currency)) {
        setCurrency(body.currency as Currency);
      }
      if (body.order_date && /^\d{4}-\d{2}-\d{2}$/.test(body.order_date)) {
        onOrderDateChange(body.order_date);
      }

      const items: {
        name: string;
        price: number | null;
        quantity: number | null;
        image_url?: string | null;
      }[] = Array.isArray(body.items) ? body.items : [];

      // Auto-pick a matching category when the form's category is still
      // empty and the OCR suggested one (e.g. grocery -> "Groceries").
      if (!categoryId && typeof body.suggested_category === "string") {
        const match = categories.find(
          (c) => c.name.toLowerCase() === body.suggested_category.toLowerCase(),
        );
        if (match) setCategoryId(match.id);
      }

      if (items.length > 1) {
        setScannedItems(
          items.map((it) => ({
            name: it.name ?? "",
            price: typeof it.price === "number" ? it.price.toFixed(2) : "",
            quantity: it.quantity && it.quantity > 1 ? String(it.quantity) : "1",
            image_url: it.image_url ?? null,
          })),
        );
        setScanFilled(true);
      } else if (items.length === 1) {
        const it = items[0];
        if (it.name) setItemName(it.name);
        if (typeof it.price === "number") setPrice(it.price.toFixed(2));
        else if (typeof body.total === "number") setPrice(body.total.toFixed(2));
        setScanFilled(true);
      } else if (typeof body.total === "number") {
        setPrice(body.total.toFixed(2));
        setScanFilled(true);
      } else {
        setScanError("Couldn't read this receipt — try a clearer image or fill the fields manually.");
      }
    } catch (e) {
      setScanError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    try {
      if (scannedItems) {
        // Multi-item submission. Strip the single-item fields and append
        // a JSON blob of the line items so the server action can do a
        // single round-trip insert.
        formData.delete("item_name");
        formData.delete("price");
        formData.append("items_json", JSON.stringify(scannedItems));
        await createReceipt(formData);
      } else {
        await createPurchase(formData);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      if (msg.includes("NEXT_REDIRECT")) throw err;
      setError(msg);
      setSubmitting(false);
    }
  }

  function updateItem(idx: number, patch: Partial<ScannedItem>) {
    if (!scannedItems) return;
    setScannedItems(scannedItems.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function removeItem(idx: number) {
    if (!scannedItems) return;
    const next = scannedItems.filter((_, i) => i !== idx);
    setScannedItems(next.length === 0 ? null : next);
  }
  function addItem() {
    setScannedItems([
      ...(scannedItems ?? []),
      { name: "", price: "", quantity: "1", image_url: null },
    ]);
  }

  const itemsTotal = (scannedItems ?? []).reduce((sum, it) => {
    const p = Number(it.price);
    const q = Number(it.quantity) || 1;
    return sum + (Number.isFinite(p) ? p * q : 0);
  }, 0);

  return (
    <form action={onSubmit} className="space-y-6">
      {scannedItems ? (
        <ScannedItemsPanel
          items={scannedItems}
          merchant={merchant}
          orderDate={orderDate}
          currency={currency}
          categoryId={categoryId}
          categories={categories}
          total={itemsTotal}
          onMerchant={setMerchant}
          onOrderDate={onOrderDateChange}
          onCurrency={setCurrency}
          onCategoryId={setCategoryId}
          onUpdate={updateItem}
          onRemove={removeItem}
          onAdd={addItem}
          onCancel={() => setScannedItems(null)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Field
              label="Item name"
              name="item_name"
              required
              placeholder="AirPods Pro"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Field
              label="Merchant"
              name="merchant"
              placeholder="Apple"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
            />
            <Field
              label="Order date"
              name="order_date"
              type="date"
              required
              value={orderDate}
              onChange={(e) => onOrderDateChange(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Price"
                name="price"
                required
                placeholder="249.00"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <div>
                <label className="label" htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="input"
                >
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="category_id">Category</label>
              <select
                id="category_id"
                name="category_id"
                className="input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <Field
              label="Return deadline"
              name="return_deadline"
              type="date"
              value={returnDeadline}
              onChange={(e) => setReturnDeadline(e.target.value)}
              help="Defaults to 30 days from order date."
            />
            <Field
              label="Warranty end"
              name="warranty_end"
              type="date"
              value={warrantyEnd}
              onChange={(e) => setWarrantyEnd(e.target.value)}
              help="Defaults to 1 year from order date."
            />
            <div>
              <label className="label" htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="input"
                placeholder="Anything you want to remember about this purchase…"
              />
            </div>
          </div>
        </div>
      )}

      {/* The file input MUST stay mounted across mode switches. If we
          unmounted it when scannedItems flips on, the browser would drop
          the user's selected file (file inputs can't be set
          programmatically), and createReceipt would never get the image. */}
      <ReceiptInput
        ocrEnabled={ocrEnabled}
        hasReceipt={hasReceipt}
        scanning={scanning}
        scanError={scanError}
        scanFilled={scanFilled}
        onScan={onScan}
        receiptRef={receiptRef}
        onChange={() => {
          setHasReceipt(Boolean(receiptRef.current?.files?.length));
          setScanError(null);
          setScanFilled(false);
        }}
      />

      {error ? <p className="font-mono text-xs text-accent">{error}</p> : null}

      <div className="sticky bottom-0 -mx-8 flex items-center justify-end gap-3 border-t border-border bg-bg/85 px-8 py-4 backdrop-blur">
        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting
            ? "Saving…"
            : scannedItems
              ? `Save ${scannedItems.length} item${scannedItems.length === 1 ? "" : "s"}`
              : "Save purchase"}
        </button>
      </div>
    </form>
  );
}

function ScannedItemsPanel({
  items,
  merchant,
  orderDate,
  currency,
  categoryId,
  categories,
  total,
  onMerchant,
  onOrderDate,
  onCurrency,
  onCategoryId,
  onUpdate,
  onRemove,
  onAdd,
  onCancel,
}: {
  items: ScannedItem[];
  merchant: string;
  orderDate: string;
  currency: Currency;
  categoryId: string;
  categories: Category[];
  total: number;
  onMerchant: (v: string) => void;
  onOrderDate: (v: string) => void;
  onCurrency: (v: Currency) => void;
  onCategoryId: (v: string) => void;
  onUpdate: (idx: number, patch: Partial<ScannedItem>) => void;
  onRemove: (idx: number) => void;
  onAdd: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-card border border-accent/30 bg-accent-50/50 px-4 py-3 text-sm text-accent">
        <div className="flex items-center justify-between gap-3">
          <span>
            <Sparkles className="mr-1 inline h-3.5 w-3.5" />
            Found {items.length} items on this receipt — review and save.
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-accent underline-offset-2 hover:underline"
          >
            Enter manually instead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Field
          label="Merchant"
          name="merchant"
          value={merchant}
          onChange={(e) => onMerchant(e.target.value)}
          placeholder="Whole Foods"
        />
        <Field
          label="Date"
          name="order_date"
          type="date"
          required
          value={orderDate}
          onChange={(e) => onOrderDate(e.target.value)}
        />
        <div>
          <label className="label" htmlFor="currency">Currency</label>
          <select
            id="currency"
            name="currency"
            value={currency}
            onChange={(e) => onCurrency(e.target.value as Currency)}
            className="input"
          >
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="category_id">Category (all items)</label>
          <select
            id="category_id"
            name="category_id"
            className="input"
            value={categoryId}
            onChange={(e) => onCategoryId(e.target.value)}
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg/60 font-mono text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="w-12 px-2 py-2" />
              <th className="px-3 py-2 text-left">Item</th>
              <th className="px-3 py-2 text-right w-20">Qty</th>
              <th className="px-3 py-2 text-right w-28">Price</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-2 py-2">
                  <ProductThumb imageUrl={it.image_url} name={it.name || "Item"} size="sm" />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="input"
                    value={it.name}
                    onChange={(e) => onUpdate(i, { name: e.target.value })}
                    placeholder="Bananas"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="input text-right"
                    inputMode="numeric"
                    value={it.quantity}
                    onChange={(e) => onUpdate(i, { quantity: e.target.value })}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="input text-right"
                    inputMode="decimal"
                    value={it.price}
                    onChange={(e) => onUpdate(i, { price: e.target.value })}
                    placeholder="0.00"
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    aria-label="Remove item"
                    className="rounded-md p-1.5 text-muted transition-colors hover:bg-bg hover:text-accent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-bg/60">
              <td />
              <td className="px-3 py-2">
                <button
                  type="button"
                  onClick={onAdd}
                  className="inline-flex items-center gap-1 text-sm text-accent"
                >
                  <Plus className="h-4 w-4" /> Add item
                </button>
              </td>
              <td />
              <td className="px-3 py-2 text-right text-sm font-medium tabular-nums">
                {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(total)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function ReceiptInput({
  ocrEnabled,
  hasReceipt,
  scanning,
  scanError,
  scanFilled,
  onScan,
  receiptRef,
  onChange,
}: {
  ocrEnabled: boolean;
  hasReceipt: boolean;
  scanning: boolean;
  scanError: string | null;
  scanFilled: boolean;
  onScan: () => void;
  receiptRef: React.RefObject<HTMLInputElement>;
  onChange: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="label mb-0" htmlFor="receipt">Receipt (optional)</label>
        {ocrEnabled && hasReceipt ? (
          <button
            type="button"
            onClick={onScan}
            disabled={scanning}
            className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {scanning ? "Scanning…" : "Scan with AI"}
          </button>
        ) : null}
      </div>
      <input
        ref={receiptRef}
        id="receipt"
        name="receipt"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
        onChange={onChange}
        className="mt-1.5 block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent hover:file:text-white file:transition-colors"
      />
      <p className="mt-1 text-xs text-muted">PNG, JPG, WEBP, GIF, or PDF up to 10MB.</p>
      {scanError ? (
        <p className="mt-2 text-xs text-red-600">{scanError}</p>
      ) : scanFilled ? (
        <p className="mt-2 text-xs text-accent">Filled from receipt — review before saving.</p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  help,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; help?: string }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} className="input" {...rest} />
      {help ? <p className="mt-1 text-xs text-muted">{help}</p> : null}
    </div>
  );
}
