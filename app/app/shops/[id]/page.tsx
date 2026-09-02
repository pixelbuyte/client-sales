import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { STAGE_LABELS, type ShopStage } from "@/lib/shops";
import { fmtDate } from "@/lib/dates";
import { GeneratePayLinkButton } from "@/components/GeneratePayLinkButton";
import { GoLiveButton } from "@/components/GoLiveButton";
import { markDemoBooked, markAttended } from "../actions";

export const dynamic = "force-dynamic";

export default async function ShopDetailPage({ params }: { params: { id: string } }) {
  const admin = createAdminClient();
  const { data: shop } = await admin.from("shops").select("*").eq("id", params.id).single();
  if (!shop) notFound();

  const { data: events } = await admin
    .from("payment_events")
    .select("id, type, created_at")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false })
    .limit(20);

  async function bumpDemoBooked() {
    "use server";
    await markDemoBooked(shop.id);
  }
  async function bumpAttended() {
    "use server";
    await markAttended(shop.id);
  }

  return (
    <>
      <div className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {STAGE_LABELS[shop.stage as ShopStage]}
        </div>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          {shop.business_name}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card p-6 md:col-span-2">
          <h2 className="font-display text-base font-semibold">Contact</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <Field label="Contact name" value={shop.contact_name} />
            <Field label="Email" value={shop.contact_email} />
            <Field label="Phone" value={shop.contact_phone} />
            <Field label="Service area" value={shop.service_area} />
            <Field label="Source" value={shop.source} />
            <Field label="Added" value={fmtDate(shop.created_at)} />
          </dl>
          {shop.notes ? (
            <div className="mt-4 border-t border-border pt-4">
              <div className="label">Notes</div>
              <p className="text-sm">{shop.notes}</p>
            </div>
          ) : null}
        </div>

        <div className="card p-6">
          <h2 className="font-display text-base font-semibold">Stripe</h2>
          <dl className="mt-3 space-y-2 text-xs">
            <Field label="Customer" value={shop.stripe_customer_id} mono />
            <Field label="Setup session" value={shop.stripe_setup_checkout_session_id} mono />
            <Field label="Subscription" value={shop.stripe_subscription_id} mono />
            <Field label="Subscription status" value={shop.subscription_status} />
            <Field label="Setup paid" value={shop.setup_paid_at ? fmtDate(shop.setup_paid_at) : null} />
            <Field label="Live at" value={shop.live_at ? fmtDate(shop.live_at) : null} />
            <Field
              label="Subscription started"
              value={shop.subscription_started_at ? fmtDate(shop.subscription_started_at) : null}
            />
            {shop.refunded ? (
              <Field label="Refunded" value={shop.refunded_at ? fmtDate(shop.refunded_at) : "yes"} />
            ) : null}
          </dl>
        </div>
      </div>

      <div className="mt-6 card p-6">
        <h2 className="font-display text-base font-semibold">Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {shop.stage === "prospect" ? (
            <form action={bumpDemoBooked}>
              <button type="submit" className="btn-secondary">
                Mark demo booked
              </button>
            </form>
          ) : null}
          {shop.stage === "demo_booked" ? (
            <form action={bumpAttended}>
              <button type="submit" className="btn-secondary">
                Mark attended
              </button>
            </form>
          ) : null}
          {shop.stage === "attended" || shop.stage === "payment_link_sent" || shop.stage === "prospect" ? (
            <GeneratePayLinkButton shopId={shop.id} />
          ) : null}
          {shop.stage === "paid" ? <GoLiveButton shopId={shop.id} /> : null}
          {shop.stage === "live" || shop.stage === "subscription_active" ? (
            <p className="text-sm text-muted">
              {shop.stage === "subscription_active"
                ? "Subscription active."
                : "Live — waiting on subscription confirmation."}
            </p>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-muted">
          Pay links are never sent automatically — copy the link above and send it yourself only
          after the shop has said yes on a call.
        </p>
      </div>

      <div className="mt-6 card p-6">
        <h2 className="font-display text-base font-semibold">Payment history</h2>
        {(events ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-muted">No Stripe events recorded yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {(events ?? []).map((e) => (
              <li key={e.id} className="flex items-center justify-between py-2 text-sm">
                <span className="font-mono text-xs">{e.type}</span>
                <span className="text-xs text-muted">{fmtDate(e.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function Field({ label, value, mono }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted">{label}</div>
      <div className={mono ? "truncate font-mono text-xs" : "text-sm"}>{value ?? "—"}</div>
    </div>
  );
}
