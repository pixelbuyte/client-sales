import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Events that mutate shop state. Anything not in this set still gets logged
// into payment_events for auditing but skips handleEvent.
const RELEVANT = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
  "charge.refunded",
]);

// Forward-only stage ordering: a webhook should never move a shop backwards
// through the funnel (e.g. a delayed checkout.session.completed retry
// arriving after the shop is already live).
const STAGE_RANK: Record<string, number> = {
  prospect: 0,
  demo_booked: 1,
  attended: 2,
  payment_link_sent: 3,
  paid: 4,
  live: 5,
  subscription_active: 6,
};

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook not configured" }, { status: 500 });
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  const raw = await req.text();

  // Construct the client outside the try so a misconfigured STRIPE_SECRET_KEY
  // surfaces as a 500 instead of being mislabelled as a 400 signature failure
  // (which could cause Stripe to back off retries).
  let client: ReturnType<typeof stripe>;
  try {
    client = stripe();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }

  let event: Stripe.Event;
  try {
    event = client.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    return NextResponse.json(
      { error: `signature verification failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // Idempotency: skip if we've recorded this event before. The unique
  // constraint on stripe_event_id makes this safe under retries even if two
  // pods process the event simultaneously — only one INSERT succeeds.
  const dedup = await admin
    .from("payment_events")
    .select("id")
    .eq("stripe_event_id", event.id)
    .maybeSingle();
  if (dedup.error) {
    return NextResponse.json({ error: dedup.error.message }, { status: 500 });
  }
  if (dedup.data) return NextResponse.json({ received: true, dedup: true });

  let shopId: string | null = null;
  if (!RELEVANT.has(event.type)) {
    const { error } = await admin.from("payment_events").insert({
      shop_id: null,
      stripe_event_id: event.id,
      type: event.type,
      payload: event as unknown as Record<string, unknown>,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ received: true });
  }

  try {
    shopId = await handleEvent(admin, client, event);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }

  // Only record AFTER handleEvent succeeds. If the insert here fails Stripe
  // will retry the event; on retry the dedup SELECT misses and handleEvent
  // runs again. The shop updates inside handleEvent are idempotent.
  const { error: logErr } = await admin.from("payment_events").insert({
    shop_id: shopId,
    stripe_event_id: event.id,
    type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });
  if (logErr) {
    return NextResponse.json({ error: logErr.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

type Admin = ReturnType<typeof createAdminClient>;
type StripeClient = ReturnType<typeof stripe>;

async function advanceStage(admin: Admin, shopId: string, nextStage: string) {
  const { data: shop, error } = await admin
    .from("shops")
    .select("stage")
    .eq("id", shopId)
    .single();
  if (error || !shop) return;
  if (STAGE_RANK[nextStage] > STAGE_RANK[shop.stage]) {
    await admin.from("shops").update({ stage: nextStage }).eq("id", shopId);
  }
}

// Returns the shop_id the event applies to, if any, so it can be recorded
// on the payment_events row.
async function handleEvent(admin: Admin, client: StripeClient, event: Stripe.Event): Promise<string | null> {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const shopId =
      session.client_reference_id ??
      (typeof session.metadata?.shop_id === "string" ? session.metadata.shop_id : null);
    if (!shopId) return null;

    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

    if (session.mode === "payment") {
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null;
      const { error } = await admin
        .from("shops")
        .update({
          ...(customerId ? { stripe_customer_id: customerId } : {}),
          stripe_setup_checkout_session_id: session.id,
          stripe_setup_payment_intent_id: paymentIntentId,
          setup_paid_at: new Date().toISOString(),
        })
        .eq("id", shopId);
      if (error) throw new Error(`shops update failed: ${error.message}`);
      await advanceStage(admin, shopId, "paid");
    } else if (session.mode === "subscription") {
      // Fallback path only — the primary go-live path creates the
      // subscription directly via the API (see app/app/shops/[id]/actions.ts)
      // and doesn't go through Checkout.
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null;
      const { error } = await admin
        .from("shops")
        .update({
          ...(customerId ? { stripe_customer_id: customerId } : {}),
          stripe_subscription_id: subscriptionId,
          subscription_started_at: new Date().toISOString(),
        })
        .eq("id", shopId);
      if (error) throw new Error(`shops update failed: ${error.message}`);
      await advanceStage(admin, shopId, "live");
    }
    return shopId;
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

    const { data: shop } = await admin
      .from("shops")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    if (!shop) return null;

    // Source of truth is the customer's live subscriptions in Stripe, not
    // the event payload, so retries and out-of-order delivery are safe.
    const subs = await client.subscriptions.list({ customer: customerId, status: "all", limit: 10 });
    const liveActive = subs.data.find((s) => ["active", "trialing", "past_due"].includes(s.status));

    const status: "active" | "past_due" | "canceled" | null = liveActive
      ? liveActive.status === "past_due"
        ? "past_due"
        : "active"
      : "canceled";

    const { error } = await admin
      .from("shops")
      .update({
        subscription_status: status,
        stripe_subscription_id: liveActive?.id ?? sub.id,
      })
      .eq("id", shop.id);
    if (error) throw new Error(`shops update failed: ${error.message}`);

    if (status === "active") {
      await advanceStage(admin, shop.id, "subscription_active");
    }
    return shop.id;
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
    if (!customerId) return null;
    const { data: shop } = await admin
      .from("shops")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    if (!shop) return null;
    const { error } = await admin
      .from("shops")
      .update({ subscription_status: "past_due" })
      .eq("id", shop.id);
    if (error) throw new Error(`shops update failed: ${error.message}`);
    return shop.id;
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const customerId = typeof charge.customer === "string" ? charge.customer : charge.customer?.id;
    if (!customerId) return null;
    const { data: shop } = await admin
      .from("shops")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    if (!shop) return null;
    const { error } = await admin
      .from("shops")
      .update({ refunded: true, refunded_at: new Date().toISOString() })
      .eq("id", shop.id);
    if (error) throw new Error(`shops update failed: ${error.message}`);
    return shop.id;
  }

  return null;
}
