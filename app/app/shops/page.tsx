import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { STAGE_LABELS, STAGE_ORDER, type ShopStage } from "@/lib/shops";
import { fmtDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: { stage?: string };
}) {
  const admin = createAdminClient();
  let query = admin
    .from("shops")
    .select("id, business_name, contact_name, contact_email, stage, service_area, created_at")
    .order("created_at", { ascending: false });

  const stageFilter = searchParams.stage;
  if (stageFilter && STAGE_ORDER.includes(stageFilter as ShopStage)) {
    query = query.eq("stage", stageFilter);
  }

  const { data: shops } = await query;
  const rows = shops ?? [];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {rows.length} shop{rows.length === 1 ? "" : "s"}
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Shops</h1>
        </div>
        <Link href="/app/shops/new" className="btn-primary">
          Add shop
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/app/shops"
          className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
            !stageFilter ? "bg-accent text-white" : "border border-border text-muted hover:text-ink"
          }`}
        >
          All
        </Link>
        {STAGE_ORDER.map((stage) => (
          <Link
            key={stage}
            href={`/app/shops?stage=${stage}`}
            className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
              stageFilter === stage ? "bg-accent text-white" : "border border-border text-muted hover:text-ink"
            }`}
          >
            {STAGE_LABELS[stage]}
          </Link>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-widest text-muted">
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((s) => (
              <tr key={s.id} className="hover:bg-bg">
                <td className="px-4 py-3">
                  <Link href={`/app/shops/${s.id}`} className="font-medium hover:text-accent">
                    {s.business_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {s.contact_name ?? s.contact_email ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted">{s.service_area ?? "—"}</td>
                <td className="px-4 py-3">{STAGE_LABELS[s.stage as ShopStage]}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{fmtDate(s.created_at)}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No shops match this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
