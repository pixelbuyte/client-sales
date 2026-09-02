import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_NAME } from "@/lib/business";
import { startSubscriptionCheckout } from "./actions";

export const dynamic = "force-dynamic";

export default async function SubscribePage({ params }: { params: { token: string } }) {
  const admin = createAdminClient();
  const { data: shop } = await admin
    .from("shops")
    .select("business_name, subscription_status")
    .eq("pay_token", params.token)
    .single();

  if (!shop) notFound();

  async function subscribe() {
    "use server";
    await startSubscriptionCheckout(params.token);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12 text-center">
      <div className="w-full max-w-md card p-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {BUSINESS_NAME}
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          Start your $750/month
        </h1>
        <p className="mt-3 text-sm text-muted">
          {shop.business_name} is live. Confirm your monthly billing to keep it running.
        </p>
        {shop.subscription_status === "active" ? (
          <p className="mt-6 text-sm text-ink">Your subscription is already active.</p>
        ) : (
          <form action={subscribe} className="mt-6">
            <button type="submit" className="btn-primary w-full">
              Start $750/month
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
