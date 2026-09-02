import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_NAME } from "@/lib/business";
import { fmtDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function PaySuccessPage({ params }: { params: { token: string } }) {
  const admin = createAdminClient();
  const { data: shop } = await admin
    .from("shops")
    .select("business_name, setup_paid_at")
    .eq("pay_token", params.token)
    .single();

  if (!shop) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12 text-center">
      <div className="w-full max-w-md card p-8">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {BUSINESS_NAME}
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          Payment received
        </h1>
        <p className="mt-3 text-sm text-ink">
          Thanks — {shop.business_name}&apos;s $2,500 setup fee
          {shop.setup_paid_at ? ` (paid ${fmtDate(shop.setup_paid_at)})` : ""} is confirmed.
        </p>
        <p className="mt-3 text-sm text-muted">
          We&apos;ll be in touch to schedule configuration. Your $750/month starts once your
          system is live — we&apos;ll let you know when that happens.
        </p>
      </div>
    </main>
  );
}
