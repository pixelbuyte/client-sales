import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/business";

export const metadata = {
  title: `Demo — ${BUSINESS_NAME}`,
  description:
    "A five-minute walkthrough: what a recovered missed call and a recovered dead estimate actually look like, message by message.",
};

export default function DemoPage() {
  return (
    <>
      <DemoNav />
      <DemoHero />
      <Scenario
        n="01"
        tag="Missed night call"
        when="Tuesday, 9:14 pm"
        setup="A no-heat call comes in after the office has closed. Nobody is at the desk. The customer does not leave a voicemail — almost nobody does."
        without={[
          { t: "9:14 pm", who: "Customer", text: "Calls the shop line. Rings out after six rings.", tone: "neutral" },
          { t: "9:14 pm", who: "Customer", text: "Hangs up. No voicemail left.", tone: "neutral" },
          { t: "9:23 pm", who: "Customer", text: "Searches “emergency furnace repair near me.” Calls the next shop.", tone: "bad" },
          { t: "Next morning", who: "Your shop", text: "Sees one missed call with no name and no context. Nobody calls back.", tone: "bad" },
        ]}
        withIt={[
          { t: "9:14 pm", who: "Customer", text: "Calls the shop line. Rings out after six rings.", tone: "neutral" },
          { t: "9:14 pm", who: "Recovery", text: "Missed call detected. Text goes out four seconds later.", tone: "good" },
          { t: "9:15 pm", who: "Customer", text: "Replies: “No heat at all, house is 54. Can someone come tomorrow?”", tone: "neutral" },
          { t: "9:15 pm", who: "Recovery", text: "Not flagged life-safety, so it's booked rather than escalated. Offers morning windows.", tone: "good" },
          { t: "9:17 pm", who: "Customer", text: "Takes the 7:30–9:30 am window. Confirmed.", tone: "good" },
          { t: "7:02 am", who: "Your shop", text: "Job is on the board with the address, the symptom, and the whole thread.", tone: "good" },
        ]}
        thread={[
          { from: "shop", text: "Sorry we missed your call — this is the after-hours line for [your shop]. Is this an emergency, or can we get you on the schedule for tomorrow?" },
          { from: "them", text: "No heat at all, house is 54. Can someone come tomorrow?" },
          { from: "shop", text: "We can. First openings tomorrow are 7:30–9:30am or 11am–1pm. Which works? If it drops below 50 tonight, text back URGENT and we'll escalate." },
          { from: "them", text: "7:30 please" },
          { from: "shop", text: "Booked — 7:30–9:30am, and we've got your address from the number on file. You'll get a text when the tech is on the way." },
        ]}
      />

      <Scenario
        n="02"
        tag="Dead estimate"
        when="Nine days after the quote"
        setup="You quoted a system replacement. They didn't say no — they just went quiet, and nobody in the shop had time to chase it."
        without={[
          { t: "Day 0", who: "Your shop", text: "Sends a written estimate for a full system replacement.", tone: "neutral" },
          { t: "Day 3", who: "Customer", text: "Reads it. Means to reply. Doesn't.", tone: "neutral" },
          { t: "Day 9", who: "Your shop", text: "Nobody follows up. The quote is in a folder now.", tone: "bad" },
          { t: "Day 30", who: "Customer", text: "Goes with whoever followed up. You never find out why you lost it.", tone: "bad" },
        ]}
        withIt={[
          { t: "Day 0", who: "Your shop", text: "Sends the same written estimate.", tone: "neutral" },
          { t: "Day 3", who: "Recovery", text: "Automatic check-in: any questions on the quote?", tone: "good" },
          { t: "Day 3", who: "Customer", text: "Replies: “Waiting to hear about financing.”", tone: "good" },
          { t: "Day 9", who: "Recovery", text: "Second touch, now that there's a real objection on the table.", tone: "good" },
          { t: "Day 10", who: "Your shop", text: "You answer the financing question yourself and close it — or you get a clean no and stop guessing.", tone: "good" },
        ]}
        thread={[
          { from: "shop", text: "Hi — following up on the replacement quote we sent Tuesday. Any questions on it, or anything you'd want priced differently?" },
          { from: "them", text: "Still waiting to hear back about financing before we decide" },
          { from: "shop", text: "Understood. Want me to have someone walk you through the payment options we work with? Takes about five minutes and might move it along." },
          { from: "them", text: "Yeah that would help actually" },
        ]}
      />

      <Scenario
        n="03"
        tag="Saturday overflow"
        when="Saturday, 11:40 am"
        setup="Everyone is on a job. Three calls stack up in twenty minutes while the phone is tied up on the first one."
        without={[
          { t: "11:40 am", who: "Caller 1", text: "Gets through. Booked.", tone: "good" },
          { t: "11:47 am", who: "Caller 2", text: "Busy signal. Hangs up.", tone: "bad" },
          { t: "11:52 am", who: "Caller 3", text: "Rings out. Hangs up.", tone: "bad" },
          { t: "Monday", who: "Your shop", text: "Two numbers in the missed list. No context, no names, nobody calls them.", tone: "bad" },
        ]}
        withIt={[
          { t: "11:40 am", who: "Caller 1", text: "Gets through. Booked as normal.", tone: "good" },
          { t: "11:47 am", who: "Recovery", text: "Caller 2 texted back immediately. Books Monday 8am.", tone: "good" },
          { t: "11:52 am", who: "Recovery", text: "Caller 3 texted back. Says it's a leak — flagged urgent.", tone: "good" },
          { t: "11:55 am", who: "Your shop", text: "You see the urgent flag and route it. The other is already on Monday's board.", tone: "good" },
        ]}
      />

      <WeeklyRecap />
      <WhatWeNeed />
      <AfterYes />
      <DemoCta />
    </>
  );
}

/* ---------------------------------------------------------------- nav --- */

function DemoNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-sea-line/80 bg-sea-bg/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link
          href="/"
          className="text-[13px] font-medium text-sea-muted transition-colors hover:text-sea-ink"
        >
          ← {BUSINESS_NAME}
        </Link>
        <span className="text-[13px] font-medium text-trust">
          5-minute demo
        </span>
      </div>
    </header>
  );
}

function DemoHero() {
  return (
    <section className="relative overflow-hidden border-b border-sea-line">
      <div className="relative mx-auto max-w-5xl px-5 py-16 md:py-20">
        <h1 className="hero-1 max-w-2xl font-serif text-[2.5rem] leading-[1.04] tracking-[-0.01em] text-sea-ink sm:text-5xl">
          Three nights at a shop
          <br />
          <span className="text-trust">that isn&apos;t running this.</span>
        </h1>
        <p className="hero-2 mt-6 max-w-xl text-[1.05rem] leading-relaxed text-sea-muted">
          Then the same three nights with it on. Same calls, same customers, same shop — every
          message below is what actually goes out. Read it and decide whether it sounds like your
          business.
        </p>
        <div className="hero-3 mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-sea-muted">
          <span>01 · Missed night call</span>
          <span>02 · Dead estimate</span>
          <span>03 · Saturday overflow</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ scenario --- */

type Beat = { t: string; who: string; text: string; tone: "neutral" | "good" | "bad" };

function Scenario({
  n,
  tag,
  when,
  setup,
  without,
  withIt,
  thread,
}: {
  n: string;
  tag: string;
  when: string;
  setup: string;
  without: Beat[];
  withIt: Beat[];
  thread?: { from: "shop" | "them"; text: string }[];
}) {
  return (
    <section className="border-b border-sea-line">
      <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <div className="mb-8 max-w-2xl">
          <div className="flex items-baseline gap-3">
            <span className="font-code text-[11px] font-bold tracking-[0.2em] text-trust">{n}</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-sea-muted">
              {when}
            </span>
          </div>
          <h2 className="mt-3 font-serif text-[1.9rem] leading-[1.1] tracking-[-0.005em] text-sea-ink sm:text-4xl">
            {tag}
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-sea-muted">{setup}</p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-ticket border border-sea-line shadow-ticket bg-sea-line lg:grid-cols-2">
          <Timeline title="Without this" beats={without} tone="lost" />
          <Timeline title="With recovery running" beats={withIt} tone="ok" />
        </div>

        {thread ? (
          <div className="mt-6">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-sea-muted">
              The actual thread
            </div>
            <MessageThread messages={thread} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Timeline({ title, beats, tone }: { title: string; beats: Beat[]; tone: "lost" | "ok" }) {
  return (
    <div className={`bg-sea-surface p-6 sm:p-7 ${tone === "ok" ? "bg-trust/[0.04]" : ""}`}>
      <div
        className={`text-[11px] font-semibold uppercase tracking-[0.13em] ${
          tone === "ok" ? "text-trust" : "text-sea-muted"
        }`}
      >
        {title}
      </div>
      <ol className="mt-5 space-y-4">
        {beats.map((b, i) => (
          <li key={i} className="grid grid-cols-[5.5rem_1fr] gap-3">
            <span className="font-code text-[11px] tabular-nums text-sea-muted/80">{b.t}</span>
            <div>
              <div
                className={`text-[11px] font-semibold uppercase tracking-[0.13em] ${
                  b.who === "Recovery" ? "text-trust" : "text-sea-muted/70"
                }`}
              >
                {b.who}
              </div>
              <p
                className={`mt-1 text-sm leading-relaxed ${
                  b.tone === "bad"
                    ? "text-stamp-missed/90"
                    : b.tone === "good"
                      ? "text-sea-ink"
                      : "text-sea-muted"
                }`}
              >
                {b.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MessageThread({ messages }: { messages: { from: "shop" | "them"; text: string }[] }) {
  return (
    <div className="rounded-ticket border border-sea-line bg-sea-surface shadow-ticket p-5 sm:p-6">
      <div className="space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "shop" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
                m.from === "shop"
                  ? "rounded-tl-sm bg-sea-raised text-sea-ink"
                  : "rounded-tr-sm bg-trust/12 text-sea-ink"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-sea-line pt-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-sea-muted/70">
        Wording is set with you during configuration — it goes out in your shop&apos;s voice, not ours
      </p>
    </div>
  );
}

/* -------------------------------------------------------------- recap --- */

const RECAP = [
  { label: "After-hours calls caught", value: "11" },
  { label: "Booked from those calls", value: "7" },
  { label: "Flagged urgent and routed", value: "2" },
  { label: "Quiet estimates that replied", value: "3" },
];

function WeeklyRecap() {
  return (
    <section className="border-b border-sea-line">
      <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <div className="mb-8 max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-trust">
            What you see
          </div>
          <h2 className="mt-3 font-serif text-[1.9rem] leading-[1.1] text-sea-ink sm:text-4xl">
            One email a week. That&apos;s the whole reporting.
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-sea-muted">
            No dashboard to check, no login to remember. If it stops earning its keep, you&apos;ll
            see it here first.
          </p>
        </div>

        <div className="overflow-hidden rounded-ticket border border-sea-line bg-sea-surface shadow-ticket">
          <div className="border-b border-sea-line bg-sea-raised px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-sea-muted">
            Weekly recap — example week
          </div>
          <div className="grid gap-px bg-sea-line sm:grid-cols-4">
            {RECAP.map((r) => (
              <div key={r.label} className="bg-sea-surface p-5">
                <div className="font-serif text-[2.4rem] leading-none text-trust">{r.value}</div>
                <div className="mt-1.5 text-xs leading-relaxed text-sea-muted">{r.label}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-sea-line px-5 py-4 text-[13px] text-sea-muted">
            Figures shown are an illustrative example, not a promise — your real numbers land in
            the same format.
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- need --- */

const NEEDS = [
  { t: "Your main line", d: "The number customers actually call. It stays yours and stays where it is." },
  { t: "Your hours", d: "When someone is genuinely at the desk, so we know where the gap starts." },
  { t: "What counts as urgent", d: "No heat below a certain temp, water, elderly or infant in the house — your call, not ours." },
  { t: "How estimates go out", d: "Email, text, paper — just so the follow-up matches how you already work." },
];

function WhatWeNeed() {
  return (
    <section className="border-b border-sea-line">
      <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <div className="mb-8 max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-trust">
            Your side of it
          </div>
          <h2 className="mt-3 font-serif text-[1.9rem] leading-[1.1] text-sea-ink sm:text-4xl">
            Four answers. That&apos;s the setup.
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-sea-muted">
            Everything else is on us. There is no install, no migration, and nothing your techs
            have to learn.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-ticket border border-sea-line shadow-ticket bg-sea-line sm:grid-cols-2">
          {NEEDS.map((n, i) => (
            <div key={n.t} className="bg-sea-surface p-6">
              <div className="text-[13px] font-semibold text-trust">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2.5 font-serif text-[1.15rem] leading-snug text-sea-ink">
                {n.t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-sea-muted">{n.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- after yes --- */

const AFTER = [
  { t: "You say yes on the call", d: "Only then do we send a payment link. Never before — you won't get one in a cold email." },
  { t: "Setup fee clears", d: "$2,500, paid in full. Work starts after it clears, not before." },
  { t: "Configuration call", d: "The four answers above, plus we write the message wording together." },
  { t: "We test it with you", d: "You call your own line and hear exactly what your customers will hear." },
  { t: "Go live", d: "It starts catching calls. This is the day the $750/month begins — not before." },
];

function AfterYes() {
  return (
    <section className="border-b border-sea-line">
      <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <div className="mb-8 max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-trust">
            The order things happen
          </div>
          <h2 className="mt-3 font-serif text-[1.9rem] leading-[1.1] text-sea-ink sm:text-4xl">
            What happens after you say yes
          </h2>
        </div>
        <ol className="relative border-l border-sea-line pl-6">
          {AFTER.map((a, i) => (
            <li key={a.t} className="relative pb-7 last:pb-0">
              <span className="absolute -left-[27px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full border border-trust bg-sea-raised">
                <span className="h-1.5 w-1.5 rounded-full bg-trust" />
              </span>
              <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-sea-muted">
                Step {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-1 font-serif text-[1.2rem] leading-snug text-sea-ink">
                {a.t}
              </h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-sea-muted">{a.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- cta --- */

function DemoCta() {
  return (
    <section className="">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-24">
        <h2 className="font-serif text-4xl leading-[1.05] text-sea-ink sm:text-4xl">
          Sound like your shop?
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[1.05rem] leading-relaxed text-sea-muted">
          Next step is a fifteen-minute call — enough to tell whether this is worth doing for your
          business, or whether it plainly isn&apos;t.
        </p>
        <p className="mt-8 text-[13px] font-medium text-sea-muted">
          Reply to the email that sent you here
        </p>
        <div className="mt-10 border-t border-sea-line pt-6">
          <Link
            href="/"
            className="text-[13px] font-medium text-sea-muted transition-colors hover:text-sea-ink"
          >
            ← Back to the overview
          </Link>
        </div>
      </div>
    </section>
  );
}
