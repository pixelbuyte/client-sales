import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_NAME } from "@/lib/business";
import { startSetupCheckout } from "./actions";

export const dynamic = "force-dynamic";

export default async function PayPage({ params }: { params: { token: string } }) {
  const admin = createAdminClient();
  const { data: shop } = await admin
    .from("shops")
    .select("business_name, stage")
    .eq("pay_token", params.token)
    .single();

  if (!shop) notFound();

  const alreadyPaid = shop.stage !== "prospect" && shop.stage !== "demo_booked" &&
    shop.stage !== "attended" && shop.stage !== "payment_link_sent";

  async function pay() {
    "use server";
    await startSetupCheckout(params.token);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {BUSINESS_NAME}
          </div>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Setup agreement for {shop.business_name}
          </h1>
        </div>

        <div className="card p-7">
          <div className="mb-6 border-b border-dashed border-border pb-5">
            <h2 className="font-display text-base font-semibold">
              What you&apos;re agreeing to
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink">
              <li>
                <span className="font-medium">$2,500 one-time setup fee</span>, paid in full
                today, before any work starts.
              </li>
              <li>
                We configure your missed-call and dead-estimate recovery, then bring it live
                for {shop.business_name}.
              </li>
              <li>
                <span className="font-medium">$750/month</span> starts only once your system is
                live — not today, and not before.
              </li>
            </ul>
          </div>

          {alreadyPaid ? (
            <p className="text-sm text-muted">
              This setup fee has already been paid. If you need a receipt or have a question,
              reach out to whoever sent you this link.
            </p>
          ) : (
            <form action={pay}>
              <button type="submit" className="btn-primary w-full">
                Pay $2,500 setup
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                Card or bank transfer (ACH) accepted, via Stripe.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
