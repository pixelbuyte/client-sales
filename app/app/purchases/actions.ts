"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { parseDollarsToCents } from "@/lib/format";
import { findProductImage } from "@/lib/product-image";

const FREE_TIER_LIMIT = 10;

function s(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

async function uploadReceipt(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  file: File,
): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Receipt must be 10MB or smaller.");
  }
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("receipts")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) throw new Error(`Upload failed: ${upErr.message}`);
  return path;
}

export async function createPurchase(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  if ((profile?.plan ?? "free") === "free") {
    const { count } = await supabase
      .from("purchases")
      .select("id", { count: "exact", head: true });
    if ((count ?? 0) >= FREE_TIER_LIMIT) {
      redirect("/app/upgrade?reason=limit");
    }
  }

  const itemName = s(formData.get("item_name"));
  const orderDate = s(formData.get("order_date"));
  const priceStr = s(formData.get("price"));
  if (!itemName || !orderDate || !priceStr) {
    throw new Error("Item name, order date, and price are required.");
  }

  const priceCents = parseDollarsToCents(priceStr);
  if (priceCents <= 0) throw new Error("Price must be greater than 0.");

  const categoryId = s(formData.get("category_id"));
  const merchantName = s(formData.get("merchant"));
  const insert: {
    user_id: string;
    item_name: string;
    merchant: string | null;
    order_date: string;
    price_cents: number;
    currency: string;
    category_id: string | null;
    return_deadline: string | null;
    warranty_end: string | null;
    notes: string | null;
    receipt_path: string | null;
    image_url: string | null;
  } = {
    user_id: user.id,
    item_name: itemName,
    merchant: merchantName,
    order_date: orderDate,
    price_cents: priceCents,
    currency: s(formData.get("currency")) ?? "USD",
    category_id: categoryId,
    return_deadline: s(formData.get("return_deadline")),
    warranty_end: s(formData.get("warranty_end")),
    notes: s(formData.get("notes")),
    receipt_path: null,
    image_url: await findProductImage(itemName, merchantName).catch(() => null),
  };

  const receipt = formData.get("receipt") as File | null;
  if (receipt && receipt.size > 0) {
    insert.receipt_path = await uploadReceipt(supabase, user.id, receipt);
  }

  const { error } = await supabase.from("purchases").insert(insert);
  if (error) throw new Error(error.message);

  revalidatePath("/app");
  revalidatePath("/app/purchases");
  redirect("/app/purchases");
}

const ItemsSchema = z.array(
  z.object({
    name: z.string().min(1).max(200),
    price: z.string(),
    quantity: z.string().optional(),
  }),
);

export async function createReceipt(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const orderDate = s(formData.get("order_date"));
  if (!orderDate) throw new Error("Date is required.");

  const itemsJson = s(formData.get("items_json"));
  if (!itemsJson) throw new Error("No items to save.");

  let parsed: z.infer<typeof ItemsSchema>;
  try {
    parsed = ItemsSchema.parse(JSON.parse(itemsJson));
  } catch {
    throw new Error("Invalid items payload.");
  }

  const items = parsed
    .map((it) => ({
      name: it.name.trim(),
      price_cents: parseDollarsToCents(it.price),
      quantity: Math.max(1, Math.floor(Number(it.quantity ?? "1") || 1)),
    }))
    .filter((it) => it.name.length > 0 && it.price_cents > 0);

  if (items.length === 0) {
    throw new Error("Add at least one item with a name and price.");
  }

  // Free tier paywall: count line items, since each becomes a purchases row.
  if ((profile?.plan ?? "free") === "free") {
    const { count } = await supabase
      .from("purchases")
      .select("id", { count: "exact", head: true });
    if ((count ?? 0) + items.length > FREE_TIER_LIMIT) {
      redirect("/app/upgrade?reason=limit");
    }
  }

  const merchant = s(formData.get("merchant"));
  const currency = s(formData.get("currency")) ?? "USD";
  const categoryId = s(formData.get("category_id"));

  let receiptPath: string | null = null;
  const receipt = formData.get("receipt") as File | null;
  if (receipt && receipt.size > 0) {
    receiptPath = await uploadReceipt(supabase, user.id, receipt);
  }

  const totalCents = items.reduce((sum, it) => sum + it.price_cents * it.quantity, 0);

  const { data: receiptRow, error: rErr } = await supabase
    .from("receipts")
    .insert({
      user_id: user.id,
      merchant,
      order_date: orderDate,
      total_cents: totalCents,
      currency,
      receipt_path: receiptPath,
    })
    .select("id")
    .single();
  if (rErr || !receiptRow) throw new Error(rErr?.message ?? "Failed to create receipt.");

  // Lookup product images in parallel. Each lookup is best-effort with a
  // short timeout, and any individual failure resolves to null rather
  // than aborting the save.
  const images = await Promise.all(
    items.map((it) =>
      findProductImage(it.name, merchant).catch(() => null),
    ),
  );

  const purchaseRows = items.map((it, i) => ({
    user_id: user.id,
    receipt_id: receiptRow.id,
    item_name: it.name,
    merchant,
    order_date: orderDate,
    price_cents: it.price_cents,
    currency,
    category_id: categoryId,
    quantity: it.quantity,
    receipt_path: receiptPath,
    image_url: images[i],
  }));

  const { error: pErr } = await supabase.from("purchases").insert(purchaseRows);
  if (pErr) {
    // Best-effort rollback: delete the orphaned receipts row so the user
    // doesn't end up with an empty receipt header.
    await supabase.from("receipts").delete().eq("id", receiptRow.id);
    throw new Error(pErr.message);
  }

  revalidatePath("/app");
  revalidatePath("/app/purchases");
  revalidatePath("/app/receipts");
  redirect(`/app/receipts/${receiptRow.id}`);
}
