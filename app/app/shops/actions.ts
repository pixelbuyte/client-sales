"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { appUrl } from "@/lib/shops";
import { BUSINESS_NAME } from "@/lib/business";

function s(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

export async function createShop(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const businessName = s(formData.get("business_name"));
  if (!businessName) throw new Error("Business name is required.");

  const { data, error } = await admin
    .from("shops")
    .insert({
      business_name: businessName,
      contact_name: s(formData.get("contact_name")),
      contact_email: s(formData.get("contact_email")),
      contact_phone: s(formData.get("contact_phone")),
      service_area: s(formData.get("service_area")),
      notes: s(formData.get("notes")),
      source: "manual",
    })
    .select("id")
    .single();
  if (error) throw new Error(`Database error: ${error.message}`);

  revalidatePath("/app/shops");
  redirect(`/app/shops/${data.id}`);
}

export async function markDemoBooked(shopId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("shops")
    .update({ stage: "demo_booked" })
    .eq("id", shopId)
    .eq("stage", "prospect");
  if (error) throw new Error(`Database error: ${error.message}`);
  revalidatePath(`/app/shops/${shopId}`);
  revalidatePath("/app/shops");
}

export async function markAttended(shopId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("shops")
    .update({ stage: "attended" })
    .eq("id", shopId)
    .eq("stage", "demo_booked");
  if (error) throw new Error(`Database error: ${error.message}`);
  revalidatePath(`/app/shops/${shopId}`);
  revalidatePath("/app/shops");
}

// Ensures a Stripe Customer exists for this shop and flips its stage to
// payment_link_sent, returning the shareable /pay/[token] URL. This is
// copied by the admin and sent manually AFTER the prospect has said yes on
// a call — it is never sent automatically. The actual Stripe Checkout
// Session is created fresh when the prospect clicks "Pay" on that page
// (see app/pay/[token]/actions.ts), not here, so a stale/expired session
// never blocks a late click.
export async function generateSetupPayLink(shopId: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: shop, error: readErr } = await admin
    .from("shops")
    .select("id, business_name, contact_email, stripe_customer_id, pay_token")
    .eq("id", shopId)
    .single();
  if (readErr || !shop) throw new Error(`Shop not found: ${readErr?.message ?? shopId}`);

  if (!shop.stripe_customer_id) {
    // Idempotency key keyed on the shop id collapses concurrent calls onto
    // the same Stripe customer.
    const customer = await stripe().customers.create(
      {
        name: shop.business_name,
        email: shop.contact_email ?? undefined,
        metadata: { shop_id: shop.id },
      },
      { idempotencyKey: `customer:create:shop:${shop.id}` },
    );
    const { error: updErr } = await admin
      .from("shops")
      .update({ stripe_customer_id: customer.id })
      .eq("id", shop.id);
    if (updErr) throw new Error(`Database error: ${updErr.message}`);
  }

  const { error: stageErr } = await admin
    .from("shops")
    .update({ stage: "payment_link_sent" })
    .eq("id", shop.id)
    .in("stage", ["prospect", "demo_booked", "attended", "payment_link_sent"]);
  if (stageErr) throw new Error(`Database error: ${stageErr.message}`);

  revalidatePath(`/app/shops/${shopId}`);
  revalidatePath("/app/shops");

  return { payUrl: `${appUrl()}/pay/${shop.pay_token}`, businessName: BUSINESS_NAME };
}

export type GoLiveResult =
  | { ok: true }
  | { ok: false; error: string; fallbackUrl?: string };

// Manual go-live trigger: the admin clicks "Mark Live" once a shop is
// configured and ready. This starts the $750/month subscription immediately
// by charging the payment method saved during the setup checkout — no
// further action from the shop is needed. If that off-session charge fails
// (e.g. requires 3DS, or the card was declined), we fall back to a second,
// shareable Checkout Session for the subscription instead of silently
// failing.
export async function goLiveAction(shopId: string): Promise<GoLiveResult> {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: shop, error: readErr } = await admin
    .from("shops")
    .select("id, stage, stripe_customer_id, pay_token")
    .eq("id", shopId)
    .single();
  if (readErr || !shop) return { ok: false, error: `Shop not found: ${readErr?.message ?? shopId}` };
  if (shop.stage !== "paid") {
    return { ok: false, error: `Shop must be in "paid" stage first (currently "${shop.stage}").` };
  }
  if (!shop.stripe_customer_id) {
    return { ok: false, error: "Shop has no Stripe customer on file yet." };
  }

  const priceId = process.env.STRIPE_PRICE_ID_SUBSCRIPTION;
  if (!priceId) return { ok: false, error: "STRIPE_PRICE_ID_SUBSCRIPTION not configured." };

  try {
    const subscription = await stripe().subscriptions.create(
      {
        customer: shop.stripe_customer_id,
        items: [{ price: priceId }],
        expand: ["latest_invoice.payment_intent"],
      },
      { idempotencyKey: `subscription:create:shop:${shop.id}` },
    );

    const invoice = subscription.latest_invoice;
    const paymentIntent =
      invoice && typeof invoice !== "string" ? invoice.payment_intent : null;
    const pi = paymentIntent && typeof paymentIntent !== "string" ? paymentIntent : null;

    if (pi && (pi.status === "requires_action" || pi.status === "requires_payment_method")) {
      // Off-session charge couldn't complete unattended — cancel this attempt
      // and fall back to a shareable subscription Checkout link instead.
      await stripe().subscriptions.cancel(subscription.id).catch(() => {});
      return await subscriptionFallback(admin, shop.id, shop.pay_token);
    }

    const { error: updErr } = await admin
      .from("shops")
      .update({
        stage: "live",
        stripe_subscription_id: subscription.id,
        live_at: new Date().toISOString(),
        subscription_status: subscription.status === "past_due" ? "past_due" : "active",
        subscription_started_at: new Date().toISOString(),
      })
      .eq("id", shop.id);
    if (updErr) return { ok: false, error: `Database error: ${updErr.message}` };

    revalidatePath(`/app/shops/${shopId}`);
    revalidatePath("/app/shops");
    return { ok: true };
  } catch (e) {
    return await subscriptionFallback(admin, shop.id, shop.pay_token, e);
  }
}

async function subscriptionFallback(
  admin: ReturnType<typeof createAdminClient>,
  shopId: string,
  payToken: string,
  cause?: unknown,
): Promise<GoLiveResult> {
  await admin.from("shops").update({ stage: "live", live_at: new Date().toISOString() }).eq("id", shopId);
  revalidatePath(`/app/shops/${shopId}`);
  revalidatePath("/app/shops");
  const message = cause instanceof Error ? cause.message : "The saved payment method couldn't be charged automatically.";
  return {
    ok: false,
    error: `${message} Send the subscription link below to collect payment.`,
    fallbackUrl: `${appUrl()}/pay/${payToken}/subscribe`,
  };
}
