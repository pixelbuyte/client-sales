export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Privacy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: today.</p>

      <h2 className="mt-8 text-lg font-semibold">What we collect</h2>
      <p className="mt-2 text-sm">
        Your shop&apos;s business name and contact details, and your Stripe customer ID and
        subscription state once you pay. We do not collect bank or card details — those go
        directly to Stripe.
      </p>

      <h2 className="mt-6 text-lg font-semibold">How we use it</h2>
      <p className="mt-2 text-sm">
        Solely to configure and run your missed-call and dead-estimate recovery, and to process
        your setup fee and monthly billing.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Sub-processors</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
        <li>Supabase — auth, database</li>
        <li>Stripe — billing</li>
        <li>Vercel — hosting</li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold">Contact</h2>
      <p className="mt-2 text-sm">Reach out to whoever set up your account.</p>
    </>
  );
}
