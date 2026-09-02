import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_NAME } from "@/lib/business";
import { startSetupCheckout } from "../actions";

export const dynamic = "force-dynamic";

export default async function PayCancelPage({ params }: { params: { token: string } }) {
  const admin = createAdminClient();
  const { data: shop } = await admin
    .from("shops")
    .select("business_name")
    .eq("pay_token", params.token)
    .single();

  if (!shop) notFound();

  async function retry() {
    "use server";
    await startSetupCheckout(params.token);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12 text-center">
      <div className="w-full max-w-md card p-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {BUSINESS_NAME}
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          Checkout canceled
        </h1>
        <p className="mt-3 text-sm text-muted">
          No charge was made to {shop.business_name}. Use the button below whenever you&apos;re
          ready to complete the $2,500 setup payment.
        </p>
        <form action={retry} className="mt-6">
          <button type="submit" className="btn-primary w-full">
            Try again
          </button>
        </form>
      </div>
    </main>
  );
}
