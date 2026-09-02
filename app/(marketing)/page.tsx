import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/business";
import { CallLog } from "@/components/marketing/CallLog";

export const metadata = {
  title: `${BUSINESS_NAME} — missed-call & dead-estimate recovery for HVAC shops`,
  description:
    "The 9pm no-heat call and the estimate nobody followed up on, turned back into booked jobs. For HVAC shops in Greater Boston and eastern MA.",
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <TheGap />
      <WhatWeRecover />
      <HowItWorks />
      <RunTheNumbers />
      <WhatThisIsNot />
      <Pricing />
      <Faq />
      <WhoItsFor />
      <FinalCta />
      <Footer />
    </>
  );
}

/* ---------------------------------------------------------------- nav --- */

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-night-line/80 bg-night-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded bg-ember font-industrial text-[13px] text-night-bg">
            H
          </span>
          <span className="font-code text-[11px] uppercase tracking-[0.18em] text-night-muted">
            {BUSINESS_NAME}
          </span>
        </Link>
        <nav className="flex items-center gap-5">
          <Link
            href="#how"
            className="hidden font-code text-[11px] uppercase tracking-[0.14em] text-night-muted transition-colors hover:text-night-ink sm:block"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="hidden font-code text-[11px] uppercase tracking-[0.14em] text-night-muted transition-colors hover:text-night-ink sm:block"
          >
            Pricing
          </Link>
          <Link
            href="/demo"
            className="rounded-sm bg-ember px-3.5 py-2 font-code text-[11px] font-bold uppercase tracking-[0.12em] text-night-bg transition-colors hover:bg-[#ff9b57]"
          >
            See the demo
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------- hero --- */

function Hero() {
  return (
    <section className="ember-bloom relative overflow-hidden border-b border-night-line">
      <div className="dispatch-grid absolute inset-0 opacity-[0.35]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
          <div>
            <div className="hero-1 inline-flex items-center gap-2 rounded-full border border-ember/35 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              <span className="font-code text-[10px] uppercase tracking-[0.16em] text-ember">
                Greater Boston · eastern MA
              </span>
            </div>

            <h1 className="hero-2 mt-6 font-industrial text-[2.6rem] uppercase leading-[0.94] tracking-[-0.02em] text-night-ink sm:text-6xl">
              Your phone rang
              <br />
              at 9:14 pm.
              <br />
              <span className="text-ember">Nobody picked up.</span>
            </h1>

            <p className="hero-3 mt-6 max-w-md text-[1.05rem] leading-relaxed text-night-muted">
              That was a no-heat call in Quincy. It went to the next shop in the search results
              nine minutes later. We put those calls — and the estimates that went quiet — back
              on your schedule.
            </p>

            <div className="hero-4 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/demo"
                className="rounded-sm bg-ember px-6 py-3.5 font-code text-xs font-bold uppercase tracking-[0.12em] text-night-bg transition-colors hover:bg-[#ff9b57]"
              >
                Watch the 5-min demo
              </Link>
              <span className="font-code text-[11px] text-night-muted">
                then a 15-minute call
              </span>
            </div>

            <p className="hero-4 mt-4 font-code text-[11px] uppercase tracking-[0.1em] text-night-muted/70">
              No signup. No app for your techs. No contract to read tonight.
            </p>
          </div>

          <div className="hero-5">
            <CallLog />
            <p className="mt-3 text-center font-code text-[11px] text-night-muted">
              ↑ Flip <span className="text-ember">Recovery</span> and watch the same night play
              out differently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- gap --- */

const HOURS = [
  { h: "6a", open: false },
  { h: "7a", open: true },
  { h: "8a", open: true },
  { h: "9a", open: true },
  { h: "10a", open: true },
  { h: "11a", open: true },
  { h: "12p", open: true },
  { h: "1p", open: true },
  { h: "2p", open: true },
  { h: "3p", open: true },
  { h: "4p", open: true },
  { h: "5p", open: false },
  { h: "6p", open: false },
  { h: "7p", open: false },
  { h: "8p", open: false },
  { h: "9p", open: false },
  { h: "10p", open: false },
  { h: "11p", open: false },
  { h: "12a", open: false },
  { h: "1a", open: false },
  { h: "2a", open: false },
  { h: "3a", open: false },
  { h: "4a", open: false },
  { h: "5a", open: false },
];

function TheGap() {
  return (
    <Section
      eyebrow="The gap"
      title="Your office is open nine hours. Your phone isn't."
      lede="Furnaces don't fail on a schedule. Neither do the calls. Everything outside the lit band is a call your team has to catch later — or not at all."
    >
      <div className="rounded-lg border border-night-line bg-night-surface p-5 sm:p-7">
        <div className="flex gap-[3px]">
          {HOURS.map((slot) => (
            <div key={slot.h} className="flex-1">
              <div
                className={`h-20 rounded-sm transition-colors sm:h-24 ${
                  slot.open ? "bg-ember/85" : "bg-night-line/70"
                }`}
                title={slot.open ? `${slot.h} — office open` : `${slot.h} — after hours`}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-[3px]">
          {HOURS.map((slot, i) => (
            <div key={slot.h} className="flex-1 text-center">
              <span
                className={`font-code text-[9px] tabular-nums ${
                  i % 3 === 0 ? "text-night-muted" : "text-transparent"
                }`}
              >
                {slot.h}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 border-t border-night-line pt-5 sm:grid-cols-3">
          <Stat k="9 hours" v="Someone is at the desk" tone="ember" />
          <Stat k="15 hours" v="Rings out, every weekday" tone="lost" />
          <Stat k="All weekend" v="Plus holidays and storm days" tone="lost" />
        </div>
      </div>
    </Section>
  );
}

function Stat({ k, v, tone }: { k: string; v: string; tone: "ember" | "lost" }) {
  return (
    <div>
      <div
        className={`font-industrial text-2xl uppercase ${
          tone === "ember" ? "text-ember" : "text-signal-lost"
        }`}
      >
        {k}
      </div>
      <div className="mt-1 text-sm text-night-muted">{v}</div>
    </div>
  );
}

/* ------------------------------------------------------------ recover --- */

function WhatWeRecover() {
  return (
    <Section
      eyebrow="What gets recovered"
      title="Two leaks. Both fixable."
      lede="This isn't lead generation. We're not buying you new customers — we're keeping the ones who already called you."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Panel
          index="Leak 01"
          title="The call nobody answered"
          body="Nights, weekends, storm days, and every hour your office manager is on another line. The customer doesn't leave a voicemail — they hang up and call the next shop."
          points={[
            "Missed call triggers a text back in seconds, not the next morning",
            "Urgent jobs — no heat, water, no AC in a heat wave — get flagged, not queued",
            "The customer picks a callback window instead of picking your competitor",
          ]}
        />
        <Panel
          index="Leak 02"
          title="The estimate that went quiet"
          body="You quoted a system replacement three weeks ago. They didn't say no. They just never replied, and nobody in the shop had time to chase it."
          points={[
            "Automatic check-in a few days after the quote goes out",
            "A second touch before it goes cold for good",
            "You hear a yes, a no, or an objection you can actually answer",
          ]}
        />
      </div>
    </Section>
  );
}

function Panel({
  index,
  title,
  body,
  points,
}: {
  index: string;
  title: string;
  body: string;
  points: string[];
}) {
  return (
    <div className="rounded-lg border border-night-line bg-night-surface p-6 sm:p-7">
      <div className="font-code text-[10px] uppercase tracking-[0.18em] text-ember">{index}</div>
      <h3 className="mt-3 font-industrial text-xl uppercase leading-tight text-night-ink sm:text-2xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-night-muted">{body}</p>
      <ul className="mt-5 space-y-2.5 border-t border-night-line pt-5">
        {points.map((p) => (
          <li key={p} className="flex gap-3 text-sm text-night-ink/90">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ember" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------------------------------------------- how --- */

const STEPS = [
  {
    n: "01",
    t: "We look at how calls reach you now",
    d: "One short call. Your main line, who answers it, what happens after 5pm, and how estimates go out today. No systems to rip out.",
  },
  {
    n: "02",
    t: "We configure it around your shop",
    d: "Set up on our side, built to your hours, your service area, and how you want urgent jobs handled. You don't install anything.",
  },
  {
    n: "03",
    t: "We test it with you before it's live",
    d: "We run real calls through it together. You hear exactly what a customer hears before a single one reaches it.",
  },
  {
    n: "04",
    t: "It runs, and you get the recap",
    d: "Recovered calls and estimate replies land back with your team. A weekly summary shows what came back and what it was worth.",
  },
];

function HowItWorks() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Four steps. You do almost none of them."
      lede="Setup is on us. The only thing we need from you is one call and a couple of answers."
    >
      <ol className="grid gap-px overflow-hidden rounded-lg border border-night-line bg-night-line md:grid-cols-2">
        {STEPS.map((s) => (
          <li key={s.n} className="bg-night-surface p-6 sm:p-7">
            <div className="font-code text-[11px] font-bold tracking-[0.18em] text-ember">
              {s.n}
            </div>
            <h3 className="mt-3 font-industrial text-lg uppercase leading-tight text-night-ink">
              {s.t}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-night-muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------------- numbers --- */

function RunTheNumbers() {
  return (
    <Section
      eyebrow="Run your own numbers"
      title="One recovered job is the whole conversation."
      lede="Don't take our figures — use yours. Fill in what a job is actually worth at your shop and the math answers itself."
    >
      <div className="overflow-hidden rounded-lg border border-night-line bg-night-surface">
        <div className="border-b border-night-line bg-night-raised px-5 py-3 font-code text-[10px] uppercase tracking-[0.16em] text-night-muted">
          Worked example — swap in your own ticket values
        </div>
        <div className="divide-y divide-night-line">
          <Row label="A no-heat service call, after hours" value="$_____" hint="example: $300–450" />
          <Row label="A system replacement you'd have lost" value="$_____" hint="example: $8,000–14,000" />
          <Row label="Recovered calls in a typical month" value="_____" hint="you'll see this in the weekly recap" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-ember/40 bg-ember/5 px-5 py-4">
          <span className="text-sm text-night-ink">What this costs you monthly, once live</span>
          <span className="font-industrial text-2xl uppercase text-ember">$750</span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-night-muted">
        We're not going to pretend to know your close rate or your average ticket. The point is
        simply that the monthly is priced below one recovered job for most shops your size — and
        if it isn&apos;t, you should not buy this.
      </p>
    </Section>
  );
}

function Row({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
      <div>
        <div className="text-sm text-night-ink">{label}</div>
        <div className="mt-0.5 font-code text-[11px] text-night-muted/70">{hint}</div>
      </div>
      <span className="font-code text-lg tabular-nums text-night-muted">{value}</span>
    </div>
  );
}

/* --------------------------------------------------------------- isn't --- */

const NOTS = [
  { t: "Not an answering service", d: "Nobody is sitting in a room pretending to be your front desk." },
  { t: "Not a new CRM", d: "Whatever you use to run jobs today, you keep using. We don't replace it." },
  { t: "Not an app for your techs", d: "Nothing to install, nothing to log into, no training day." },
  { t: "Not a marketing retainer", d: "We're not buying ads or writing blog posts. This is recovery, not acquisition." },
  { t: "Not a long contract", d: "Monthly. Stop whenever it stops paying for itself." },
  { t: "Not sold as “AI”", d: "You're buying recovered jobs. How it's built is our problem, not your pitch." },
];

function WhatThisIsNot() {
  return (
    <Section
      eyebrow="Straight answers"
      title="What this isn't"
      lede="You've been pitched before. Here's what we're not asking you to sign up for."
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-night-line bg-night-line sm:grid-cols-2 lg:grid-cols-3">
        {NOTS.map((n) => (
          <div key={n.t} className="bg-night-surface p-5">
            <div className="flex items-baseline gap-2">
              <span className="font-code text-sm text-signal-lost">✕</span>
              <h3 className="font-industrial text-[15px] uppercase leading-tight text-night-ink">
                {n.t}
              </h3>
            </div>
            <p className="mt-2 pl-6 text-sm leading-relaxed text-night-muted">{n.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- pricing --- */

function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Two numbers. No surprises."
      lede="Setup is paid in full before we start work. The monthly doesn't begin until your system is actually live."
    >
      <div className="overflow-hidden rounded-lg border border-night-line bg-night-surface">
        <div className="flex items-center justify-between border-b border-dashed border-night-line bg-night-raised px-5 py-3">
          <span className="font-code text-[10px] uppercase tracking-[0.16em] text-night-muted">
            Work order — recovery setup
          </span>
          <span className="font-code text-[10px] uppercase tracking-[0.16em] text-night-muted">
            No. 0001
          </span>
        </div>

        <div className="grid divide-y divide-night-line md:grid-cols-2 md:divide-x md:divide-y-0">
          <div className="p-7">
            <div className="font-code text-[10px] uppercase tracking-[0.16em] text-night-muted">
              One-time setup
            </div>
            <div className="mt-3 font-industrial text-5xl uppercase text-night-ink">$2,500</div>
            <p className="mt-3 text-sm leading-relaxed text-night-muted">
              Paid in full before any work starts. Covers the build, the configuration around
              your shop, and testing it with you until it&apos;s right.
            </p>
          </div>

          <div className="p-7">
            <div className="font-code text-[10px] uppercase tracking-[0.16em] text-night-muted">
              Then, monthly
            </div>
            <div className="mt-3 font-industrial text-5xl uppercase text-ember">$750</div>
            <p className="mt-3 text-sm leading-relaxed text-night-muted">
              Starts the day your system goes live — not the day you sign. Running, monitoring,
              and the weekly recap. Cancel any time.
            </p>
          </div>
        </div>

        <div className="border-t border-night-line bg-night-raised px-5 py-4">
          <p className="font-code text-[11px] leading-relaxed text-night-muted">
            No revenue share. No per-call fee. No setup on net-30 — we don&apos;t start until the
            setup fee clears, and you don&apos;t pay a monthly until it&apos;s running.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- faq --- */

const FAQS = [
  {
    q: "Do I have to change my phone number or phone system?",
    a: "No. Your number stays yours and your existing setup stays as it is. We work alongside it — that's part of what the setup call is for.",
  },
  {
    q: "I already have an answering service. Is this the same thing?",
    a: "No, and you can keep it. An answering service picks up live calls. This catches what falls through anyway — the hang-ups, the after-hours calls that never leave a message, and the estimates that go quiet weeks later.",
  },
  {
    q: "What do my techs have to do differently?",
    a: "Nothing. There's no app, no login, no new process on the truck. Recovered jobs show up the same way any other booked job does.",
  },
  {
    q: "How long until it's actually running?",
    a: "Typically days, not months, once the setup fee clears and we've had the configuration call. We won't flip it live until you've heard it working.",
  },
  {
    q: "What if it doesn't recover anything?",
    a: "Then you cancel the monthly and you've spent the setup fee finding that out. We'd rather tell you on the call that your shop isn't a fit than take the setup fee and disappoint you.",
  },
  {
    q: "Why pay the whole setup up front?",
    a: "Because the work happens up front. The build and configuration are done before you ever see it run — so that's what the setup fee covers, and it's why the monthly doesn't start until go-live.",
  },
];

function Faq() {
  return (
    <Section eyebrow="Questions" title="The ones we actually get" lede="">
      <div className="grid gap-px overflow-hidden rounded-lg border border-night-line bg-night-line md:grid-cols-2">
        {FAQS.map((f) => (
          <div key={f.q} className="bg-night-surface p-6">
            <h3 className="font-industrial text-[15px] uppercase leading-snug text-night-ink">
              {f.q}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-night-muted">{f.a}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- who --- */

function WhoItsFor() {
  return (
    <Section eyebrow="Fit" title="Who this is built for" lede="">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-lg border border-ember/30 bg-ember/[0.04] p-6 sm:p-7">
          <div className="font-code text-[10px] uppercase tracking-[0.16em] text-ember">
            A fit
          </div>
          <ul className="mt-4 space-y-3">
            {[
              "HVAC shops running roughly 5 to 30 trucks",
              "Greater Boston and eastern Massachusetts",
              "Your phone rings after hours and nobody's on it",
              "You send written estimates and some go quiet",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-sm text-night-ink/90">
                <span className="font-code text-ember">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-night-line bg-night-surface p-6 sm:p-7">
          <div className="font-code text-[10px] uppercase tracking-[0.16em] text-night-muted">
            Not a fit
          </div>
          <ul className="mt-4 space-y-3">
            {[
              "One-truck operations — the math doesn't work yet",
              "Shops already staffing a 24/7 dispatch desk",
              "Anyone outside eastern MA, for now",
              "Looking for new leads rather than keeping existing ones",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-sm text-night-muted">
                <span className="font-code text-signal-lost">✕</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ final cta -- */

function FinalCta() {
  return (
    <section className="ember-bloom border-t border-night-line">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-24">
        <h2 className="font-industrial text-3xl uppercase leading-[0.98] tracking-[-0.02em] text-night-ink sm:text-5xl">
          Watch it once.
          <br />
          <span className="text-ember">Then decide.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[1.05rem] leading-relaxed text-night-muted">
          Five minutes to see exactly what gets recovered, then a fifteen-minute call to find out
          whether your shop is a fit. Nothing to sign either way.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/demo"
            className="rounded-sm bg-ember px-7 py-4 font-code text-xs font-bold uppercase tracking-[0.12em] text-night-bg transition-colors hover:bg-[#ff9b57]"
          >
            Watch the 5-min demo
          </Link>
        </div>
        <p className="mt-5 font-code text-[11px] uppercase tracking-[0.1em] text-night-muted/70">
          No self-serve signup — reply to the email that sent you here
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- footer --- */

function Footer() {
  return (
    <footer className="border-t border-night-line bg-night-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8">
        <div>
          <div className="font-code text-[11px] uppercase tracking-[0.16em] text-night-muted">
            {BUSINESS_NAME}
          </div>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-night-muted/70">
            Missed-call and dead-estimate recovery for HVAC shops in Greater Boston and eastern
            Massachusetts.
          </p>
        </div>
        <div className="flex gap-5 font-code text-[11px] uppercase tracking-[0.12em] text-night-muted">
          <Link href="/demo" className="transition-colors hover:text-night-ink">
            Demo
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-night-ink">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-night-ink">
            Terms
          </Link>
          <Link href="/login" className="transition-colors hover:text-night-ink">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------- shared --- */

function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-night-line">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="mb-9 max-w-2xl">
          <div className="font-code text-[10px] uppercase tracking-[0.2em] text-ember">
            {eyebrow}
          </div>
          <h2 className="mt-3 font-industrial text-2xl uppercase leading-[1.02] tracking-[-0.015em] text-night-ink sm:text-4xl">
            {title}
          </h2>
          {lede ? (
            <p className="mt-4 text-[1.02rem] leading-relaxed text-night-muted">{lede}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
