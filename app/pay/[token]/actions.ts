"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { appUrl } from "@/lib/shops";

// Public action: starts (or resumes) the $2,500 setup Checkout Session for
// the shop behind this pay token. Creating the session on click, rather
// than reusing one created earlier, means a link that sits unused for a
// while never hits an expired-session error.
export async function startSetupCheckout(token: string) {
  const admin = createAdminClient();
  const { data: shop, error } = await admin
    .from("shops")
    .select("id, business_name, contact_email, stripe_customer_id, stage")
    .eq("pay_token", token)
    .single();
  if (error || !shop) throw new Error("Payment link not found.");
  if (shop.stage === "paid" || shop.stage === "live" || shop.stage === "subscription_active") {
    redirect(`/pay/${token}/success`);
  }

  const priceId = process.env.STRIPE_PRICE_ID_SETUP;
  if (!priceId) throw new Error("STRIPE_PRICE_ID_SETUP not configured.");

  let customerId = shop.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe().customers.create(
      {
        name: shop.business_name,
        email: shop.contact_email ?? undefined,
        metadata: { shop_id: shop.id },
      },
      { idempotencyKey: `customer:create:shop:${shop.id}` },
    );
    await admin.from("shops").update({ stripe_customer_id: customer.id }).eq("id", shop.id);
    customerId = customer.id;
  }

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    payment_method_types: ["card", "us_bank_account"],
    payment_intent_data: { setup_future_usage: "off_session" },
    client_reference_id: shop.id,
    metadata: { shop_id: shop.id, kind: "setup" },
    success_url: `${appUrl()}/pay/${token}/success`,
    cancel_url: `${appUrl()}/pay/${token}/cancel`,
  });

  await admin
    .from("shops")
    .update({ stripe_setup_checkout_session_id: session.id })
    .eq("id", shop.id);

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  redirect(session.url);
}
