import Link from "next/link";

// Placeholder root page. This gets replaced with a real designed landing
// page once the business name and a visual direction are picked — see
// RUNBOOK.md. Kept minimal for now so the app builds cleanly.
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        HVAC Lead Recovery
      </h1>
      <p className="max-w-md text-sm text-muted">
        Landing page coming soon.
      </p>
      <Link href="/login" className="btn-secondary">
        Admin sign in
      </Link>
    </main>
  );
}
