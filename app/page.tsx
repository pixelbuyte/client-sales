import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/business";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="hero-1 font-mono text-[10px] uppercase tracking-widest text-accent">
          {BUSINESS_NAME}
        </div>

        <h1 className="hero-2 mt-3 max-w-xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
          Every missed call is a job that dispatched itself to your competitor.
        </h1>

        <p className="hero-3 mt-5 max-w-md text-base leading-relaxed text-muted">
          We set up missed-call and dead-estimate recovery for HVAC shops — so the 9pm no-heat
          call and the estimate nobody followed up on turn back into booked jobs instead of
          write-offs.
        </p>

        <div className="hero-4 mt-8 flex flex-wrap items-center gap-3">
          <Link href="/demo" className="btn-primary">
            Watch the 5-min demo
          </Link>
          <Link href="/login" className="btn-secondary">
            Admin sign in
          </Link>
        </div>
        <p className="hero-4 mt-3 text-xs text-muted">
          Then a 15-minute call. No self-serve signup — reply to the email that sent you here.
        </p>

        <div className="hero-5 mt-12 card overflow-hidden">
          <div className="flex items-center justify-between border-b border-dashed border-border px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted">
            <span>Work order — recovery setup</span>
            <span>No. 0001</span>
          </div>
          <div className="grid grid-cols-1 divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Setup
              </div>
              <div className="mt-2 font-mono text-2xl font-medium tracking-tight">
                $2,500 <span className="text-sm font-normal text-muted">one-time</span>
              </div>
            </div>
            <div className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Monthly
              </div>
              <div className="mt-2 font-mono text-2xl font-medium tracking-tight">
                $750 <span className="text-sm font-normal text-muted">/mo, after go-live</span>
              </div>
            </div>
            <div className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Billed before work
              </div>
              <div className="mt-2 font-mono text-2xl font-medium tracking-tight">
                100% <span className="text-sm font-normal text-muted">upfront</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Step n="01" title="We watch the gaps">
            Nights, weekends, jobs on the truck — the calls your office can&apos;t get to.
          </Step>
          <Step n="02" title="We follow the dead estimates">
            Quotes that went quiet get a second touch instead of sitting in a folder.
          </Step>
          <Step n="03" title="You get the job back">
            Recovered calls and estimates land back on your schedule, not a chatbot transcript.
          </Step>
        </div>

        <div className="mt-16 border-t border-border pt-6 text-xs text-muted">
          <p>
            Not sold as &ldquo;AI.&rdquo; Not a new CRM, call center, or platform — recovered
            jobs. Serving HVAC shops (5–30 trucks) in Greater Boston / eastern MA.
          </p>
          <div className="mt-3 flex gap-4">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t-2 border-accent pt-3">
      <div className="font-mono text-xs text-accent">{n}</div>
      <h3 className="mt-1.5 font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}
