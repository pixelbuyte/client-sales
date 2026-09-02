"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { appUrl } from "@/lib/shops";

// Fallback path only, used when the automatic off-session subscription
// charge in goLiveAction fails. Creates a Checkout Session for the
// $750/month subscription so the shop can complete it themselves.
export async function startSubscriptionCheckout(token: string) {
  const admin = createAdminClient();
  const { data: shop, error } = await admin
    .from("shops")
    .select("id, business_name, contact_email, stripe_customer_id")
    .eq("pay_token", token)
    .single();
  if (error || !shop) throw new Error("Payment link not found.");
  if (!shop.stripe_customer_id) throw new Error("No Stripe customer on file for this shop yet.");

  const priceId = process.env.STRIPE_PRICE_ID_SUBSCRIPTION;
  if (!priceId) throw new Error("STRIPE_PRICE_ID_SUBSCRIPTION not configured.");

  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer: shop.stripe_customer_id,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: shop.id,
    metadata: { shop_id: shop.id, kind: "subscription" },
    success_url: `${appUrl()}/pay/${token}/success`,
    cancel_url: `${appUrl()}/pay/${token}/cancel`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  redirect(session.url);
}
