export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Terms</h1>
      <p className="mt-2 text-sm text-muted">Last updated: today.</p>

      <h2 className="mt-8 text-lg font-semibold">The service</h2>
      <p className="mt-2 text-sm">
        We set up and run missed-call and dead-estimate recovery for your HVAC shop. It is
        provided as-is, with no warranty of any specific number of jobs recovered.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Billing</h2>
      <p className="mt-2 text-sm">
        Setup is a one-time $2,500 fee, paid in full before configuration begins. Once your
        system is live, billing is $750/month via Stripe, starting on the day you go live — not
        before. You can cancel any time; access continues to the end of the current billing
        period. Refunds on the setup fee are at our discretion.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Your account</h2>
      <p className="mt-2 text-sm">
        You&apos;re responsible for the accuracy of the shop and contact information you provide.
        Don&apos;t use the service to break the law or infringe anyone&apos;s rights.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Changes</h2>
      <p className="mt-2 text-sm">
        We may update these terms; material changes will be communicated directly.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Contact</h2>
      <p className="mt-2 text-sm">Reach out to whoever set up your account.</p>
    </>
  );
}
