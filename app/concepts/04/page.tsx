import Link from "next/link";
import type { Metadata } from "next";
import { BUSINESS_NAME } from "@/lib/business";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Leaks } from "./Leaks";
import { Calculator } from "./Calculator";
import { Faq } from "./Faq";
import { PageMotion } from "./PageMotion";
import { Arrow, Check } from "./Illustrations";

export const metadata: Metadata = {
  title: `${BUSINESS_NAME} — the 9:14 pm call, booked for 7:30 am`,
  description:
    "Missed-call and dead-estimate recovery for HVAC shops in Greater Boston and eastern Massachusetts. The after-hours call gets a text back in seconds; the quiet estimate gets a second touch. $2,500 setup, $750 a month from go-live.",
};

export default function Concept04Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Facts />
        <TheGap />
        <Leaks />
        <OneNight />
        <HowItWorks />
        <YourNumbers />
        <WhatThisIsnt />
        <Pricing />
        <Questions />
        <WhoItsFor />
        <FinalCta />
      </main>
      <Footer />
      <PageMotion />
    </>
  );
}

/* ------------------------------------------------------------- shared --- */

function Head({
  index,
  eyebrow,
  title,
  lede,
  split = true,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  split?: boolean;
}) {
  return (
    <div className={`c04-head ${split ? "c04-head--split" : ""}`}>
      <p className="c04-eyebrow" data-reveal>
        <b>{index}</b> {eyebrow}
      </p>
      <h2 className="c04-h2" data-split>
        {title}
      </h2>
      {lede ? (
        <p className="c04-lede" data-reveal>
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------- facts --- */

function Facts() {
  return (
    <section className="c04-section c04-section--tight" data-nav="light" aria-labelledby="c04-facts-title">
      <div className="c04-wrap">
        <h2 id="c04-facts-title" className="c04-sr">
          The short version
        </h2>
        <div className="c04-facts" data-reveal-group>
          <div className="c04-fact">
            <div className="c04-num">
              <span data-count="4">4</span>
              <small>sec</small>
            </div>
            <p>from a missed call to a text back on the customer&apos;s phone</p>
          </div>
          <div className="c04-fact">
            <div className="c04-num">
              <span data-count="15">15</span>
              <small>hrs</small>
            </div>
            <p>your line rings out every weekday, plus the whole weekend</p>
          </div>
          <div className="c04-fact">
            <div className="c04-num">Days</div>
            <p>from the setup fee clearing to live — not months</p>
          </div>
          <div className="c04-fact">
            <div className="c04-num">
              <span data-count="0" data-prefix="$">
                $0
              </span>
            </div>
            <p>monthly until the day your system is live. Not the day you sign.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- gap --- */

const HOURS = [
  "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p",
  "6p", "7p", "8p", "9p", "10p", "11p", "12a", "1a", "2a", "3a", "4a", "5a",
];
const OPEN = new Set(["7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p"]);

function TheGap() {
  return (
    <section className="c04-section c04-grid-bg" data-nav="light" aria-labelledby="c04-gap-title">
      <div className="c04-wrap">
        <Head
          index="01"
          eyebrow="The gap"
          title={<span id="c04-gap-title">Your office is open nine hours. Your phone isn&apos;t.</span>}
          lede="Furnaces don't fail on a schedule, and neither do the calls. Everything in the dark band is a call somebody on your team has to catch later — or doesn't."
        />
        <div className="c04-gap-board" data-reveal>
          <div className="c04-gap-cell c04-gap-cell--open">
            <p className="c04-eyebrow">Someone at the desk</p>
            <div className="c04-num">
              <span data-count="9">9</span>
            </div>
            <h3>hours a day</h3>
            <p>Seven to about four, weekdays. The line gets picked up, mostly, when nobody&apos;s already on it.</p>
            <div className="c04-hours" data-bars aria-hidden="true">
              {HOURS.map((h) => (
                <div key={h} className={`c04-hour ${OPEN.has(h) ? "c04-hour--open" : ""}`} style={{ opacity: OPEN.has(h) ? 1 : 0.15 }} />
              ))}
            </div>
            <div className="c04-hour-labels" aria-hidden="true">
              {HOURS.map((h, i) => (
                <span key={h}>{i % 3 === 0 ? h : ""}</span>
              ))}
            </div>
          </div>
          <div className="c04-gap-cell c04-gap-cell--dark c04-grained">
            <p className="c04-eyebrow">Rings out</p>
            <div className="c04-num">
              <span data-count="15">15</span>
            </div>
            <h3>hours a day, and all weekend</h3>
            <p>
              Five o&apos;clock to seven the next morning. Saturday. Sunday. The storm day when four trucks are out and the
              office phone is the last thing anyone&apos;s watching.
            </p>
            <div className="c04-hours" data-bars aria-hidden="true">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className={`c04-hour ${!OPEN.has(h) ? "c04-hour--dark" : ""} ${h === "9p" ? "c04-hour--now" : ""}`}
                  style={{ opacity: OPEN.has(h) ? 1 : h === "9p" ? 1 : 0.7 }}
                />
              ))}
            </div>
            <div className="c04-hour-labels" aria-hidden="true">
              {HOURS.map((h, i) => (
                <span key={h}>{i % 3 === 0 ? h : ""}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- one night --- */

const NIGHT = [
  {
    time: "6:30",
    ampm: "am · Tuesday",
    tone: "booked",
    name: "Joanne P.",
    town: "Milton",
    said: "Had a question on the replacement quote.",
    before: "Day 9 since the quote went out. Her email sat under Tuesday's dispatch until someone got to it, if someone got to it.",
    after: "The check-in text had gone out on day 3. She replied at 6:30; the answer went back before the trucks rolled.",
    beforeTag: "Quiet",
    afterTag: "Replied",
  },
  {
    time: "9:14",
    ampm: "pm · Tuesday",
    tone: "missed",
    name: "Dana R.",
    town: "Quincy",
    said: "Furnace won't fire, house is down to 54.",
    before: "Rang out. No voicemail. At 9:23 she was on the phone with the next listing.",
    after: "Text back at 9:14:04. Flagged no-heat. She picked the 7:30 am window and stopped searching.",
    beforeTag: "Missed",
    afterTag: "Booked",
  },
  {
    time: "11:41",
    ampm: "pm · Tuesday",
    tone: "missed",
    name: "Marcus T.",
    town: "Weymouth",
    said: "No heat and we have a newborn here.",
    before: "Voicemail. Heard at 7:05 the next morning. By then it was somebody else's job.",
    after: "Flagged urgent, not queued. Your on-call tech gets it as a job, not as a voicemail to find in the morning.",
    beforeTag: "Missed",
    afterTag: "Escalated",
  },
  {
    time: "7:30",
    ampm: "am · Wednesday",
    tone: "booked",
    name: "Truck 2",
    town: "Quincy",
    said: "Dana R. No-heat. Confirmed.",
    before: "An empty slot on the board, and a customer who now has a different shop's number saved.",
    after: "On the board like any other job. Nobody had to chase it, and the weekly recap shows it came back.",
    beforeTag: "Empty slot",
    afterTag: "On the board",
  },
] as const;

function OneNight() {
  return (
    <section className="c04-section" data-nav="light" aria-labelledby="c04-night-title">
      <div className="c04-wrap">
        <Head
          index="02"
          eyebrow="One night, both ways"
          title={<span id="c04-night-title">Same Tuesday. Same four calls. Different Wednesday.</span>}
          lede="These aren't customers of ours — they're an illustration of a normal night at a 12-truck shop on the South Shore. The left side is what happens now. The right side is what happens covered."
        />
        <div className="c04-tl">
          <div className="c04-tl-rail" aria-hidden="true">
            <div className="c04-tl-line" data-line />
          </div>
          {NIGHT.map((n) => (
            <div className={`c04-tl-item c04-tl-item--${n.tone}`} key={n.time + n.name}>
              <div className="c04-tl-dot" aria-hidden="true" />
              <div className="c04-tl-time" data-reveal>
                {n.time}
                <small>{n.ampm}</small>
              </div>
              <div className="c04-tl-card" data-reveal>
                <div className="c04-tl-half c04-tl-half--before">
                  <p className="c04-eyebrow">As it stands</p>
                  <h3>
                    {n.name} <span>· {n.town}</span>
                  </h3>
                  <p className="c04-tl-said">&ldquo;{n.said}&rdquo;</p>
                  <p className="c04-tl-then">{n.before}</p>
                  <span className="c04-tag c04-tag--missed">{n.beforeTag}</span>
                </div>
                <div className="c04-tl-half c04-tl-half--after">
                  <p className="c04-eyebrow">Covered</p>
                  <h3>
                    {n.name} <span>· {n.town}</span>
                  </h3>
                  <p className="c04-tl-said">&ldquo;{n.said}&rdquo;</p>
                  <p className="c04-tl-then">{n.after}</p>
                  <span className="c04-tag">{n.afterTag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- how --- */

const STEPS = [
  {
    t: "We look at how calls reach you now",
    d: "One short call. Your main line, who answers it, what happens after five, and how estimates go out today. Nothing gets ripped out.",
    you: "You: 20 minutes",
  },
  {
    t: "We build it around your shop",
    d: "Done on our side, to your hours, your service area, and how you want urgent jobs handled. Nothing for anyone at the shop to install.",
    you: "You: a few answers",
  },
  {
    t: "We test it with you before it's live",
    d: "We run real calls through it together. You hear exactly what a customer hears before a single one reaches it.",
    you: "You: listen, approve",
  },
  {
    t: "It runs. You get the recap.",
    d: "Recovered calls and estimate replies land with your team the way any booked job does. A weekly recap shows what came back.",
    you: "You: read one email a week",
  },
];

function HowItWorks() {
  return (
    <section className="c04-section c04-navy c04-grid-bg c04-grained" id="how" data-nav="dark" aria-labelledby="c04-how-title">
      <div className="c04-wrap">
        <Head
          index="03"
          eyebrow="How it works"
          title={<span id="c04-how-title">Four steps. You do almost none of them.</span>}
          lede="Setup is on us, in days. The only things we need from you are one call and a couple of answers about how your shop runs."
        />
        <ol className="c04-steps" data-reveal-group>
          {STEPS.map((s, i) => (
            <li className="c04-step" key={s.t}>
              <div className="c04-num" style={{ color: "#F4F1EA" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3>{s.t}</h3>
              <p style={{ color: "#A7B8C6" }}>{s.d}</p>
              <span className="c04-step-you" style={{ color: "#F4F1EA" }}>
                <i aria-hidden="true" />
                {s.you}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ numbers --- */

function YourNumbers() {
  return (
    <section className="c04-section c04-grid-bg" data-nav="light" aria-labelledby="c04-numbers-title">
      <div className="c04-wrap">
        <Head
          index="04"
          eyebrow="Run your own numbers"
          title={<span id="c04-numbers-title">One recovered job is the whole conversation.</span>}
          lede="Don't take our figures. Drag these to what a job is actually worth at your shop, guess low on what you'd win back, and see whether the math clears $750."
        />
        <Calculator />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- isn't --- */

const NOTS = [
  { t: "Not an answering service", d: "Nobody is sitting in a room pretending to be your front desk. Keep yours if you have one — this catches what it drops." },
  { t: "Not a new CRM", d: "Whatever you use to run jobs today, you keep using. We don't replace it and we don't ask your office to learn something." },
  { t: "Not an app for your techs", d: "Nothing to install, nothing to log into, no training day. The truck doesn't know we exist." },
  { t: "Not lead generation", d: "We're not buying ads or writing blog posts. This keeps the customers who already called you." },
  { t: "Not a long contract", d: "Month to month. No revenue share, no per-call fee. Stop whenever it stops paying for itself." },
  { t: "Not sold as “AI”", d: "You're buying recovered jobs: the night call, the quiet estimate. How it's built is our problem, not your pitch." },
];

function WhatThisIsnt() {
  return (
    <section className="c04-section" data-nav="light" aria-labelledby="c04-nots-title">
      <div className="c04-wrap">
        <Head
          index="05"
          eyebrow="Straight answers"
          title={<span id="c04-nots-title">What this isn&apos;t.</span>}
          lede="You've been pitched before. Here's what we're not asking you to sign up for."
        />
        <div className="c04-nots" data-reveal-group>
          {NOTS.map((n) => (
            <div className="c04-not" key={n.t}>
              <div className="c04-not-x" aria-hidden="true">
                ✕
              </div>
              <h3>{n.t}</h3>
              <p>{n.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- pricing --- */

function Pricing() {
  return (
    <section className="c04-section c04-grid-bg" id="pricing" data-nav="light" aria-labelledby="c04-pricing-title">
      <div className="c04-wrap">
        <Head
          index="06"
          eyebrow="Pricing"
          title={<span id="c04-pricing-title">Two numbers. No surprises.</span>}
          lede="Setup is paid in full before we start work. The monthly doesn't begin until your system is actually live."
        />
        <div className="c04-price" data-reveal>
          <div className="c04-price-cell c04-price-cell--setup c04-grained">
            <p className="c04-eyebrow">One-time setup</p>
            <div className="c04-num">
              <span data-count="2500" data-prefix="$">
                $2,500
              </span>
            </div>
            <h3>Paid in full before any work starts.</h3>
            <p>
              Covers the build, the configuration around your hours and service area, and testing it with you until
              it&apos;s right. The work happens up front, so that&apos;s when it&apos;s paid.
            </p>
          </div>
          <div className="c04-price-cell c04-price-cell--monthly">
            <p className="c04-eyebrow">Then, monthly</p>
            <div className="c04-num">
              <span data-count="750" data-prefix="$">
                $750
              </span>
              <small>/ mo</small>
            </div>
            <h3>Starts the day you go live. Not the day you sign.</h3>
            <p>
              Running it, watching it, and the weekly recap. Month to month. If it stops paying for itself, you stop
              paying for it.
            </p>
          </div>
          <div className="c04-price-rule">
            <ul className="c04-terms">
              {["Month to month", "Cancel any time", "No revenue share", "No per-call fee", "No long contract"].map((t) => (
                <li key={t}>
                  <Check size={14} />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/demo" className="c04-btn">
              Watch the demo first <Arrow />
            </Link>
          </div>
        </div>

        <div className="c04-golive" data-reveal>
          <div>
            <h3>The go-live rule</h3>
            <p>
              The monthly is tied to one thing: the day your system is live and taking calls. Not the day you pay the
              setup fee, not the day we start building.
            </p>
          </div>
          <div className="c04-rail">
            <div className="c04-rail-line" data-rail aria-hidden="true" />
            <div className="c04-rail-step">
              <b>Verbal yes</b>
              <span>on the 15-minute call</span>
            </div>
            <div className="c04-rail-step">
              <b>Setup paid</b>
              <span>$2,500, in full, by pay link</span>
            </div>
            <div className="c04-rail-step">
              <b>We build</b>
              <span>days, not months — $0 monthly</span>
            </div>
            <div className="c04-rail-step">
              <b>You hear it work</b>
              <span>real calls, together — still $0 monthly</span>
            </div>
            <div className="c04-rail-step c04-rail-step--live">
              <b>Live</b>
              <span>$750 / mo starts today</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- faq --- */

function Questions() {
  return (
    <section className="c04-section" data-nav="light" aria-labelledby="c04-faq-title">
      <div className="c04-wrap">
        <Head index="07" eyebrow="Questions" title={<span id="c04-faq-title">The ones we actually get.</span>} />
        <Faq />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- who --- */

function WhoItsFor() {
  return (
    <section className="c04-section c04-grid-bg" data-nav="light" aria-labelledby="c04-fit-title">
      <div className="c04-wrap">
        <Head
          index="08"
          eyebrow="Fit"
          title={<span id="c04-fit-title">Who this is built for.</span>}
          lede="We'd rather tell you it's not a fit on the call than take a setup fee from a shop where the math doesn't work."
        />
        <div className="c04-fit" data-reveal>
          <div className="c04-fit-cell c04-fit-cell--yes c04-grained">
            <p className="c04-eyebrow">A fit</p>
            <h3>Five to thirty trucks, eastern Mass.</h3>
            <ul>
              {[
                "HVAC shops running roughly 5 to 30 trucks",
                "Greater Boston and eastern Massachusetts — Quincy to Plymouth, Waltham to Salem",
                "Your phone rings after hours and nobody's on it",
                "You send written estimates and some of them go quiet",
              ].map((t) => (
                <li key={t}>
                  <Check />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="c04-fit-cell c04-fit-cell--no">
            <p className="c04-eyebrow">Not a fit</p>
            <h3>Be honest with yourself here.</h3>
            <ul>
              {[
                "One-truck operations — the math doesn't work yet",
                "Shops already staffing a 24/7 dispatch desk",
                "Anyone outside eastern Massachusetts, for now",
                "Looking for new leads rather than keeping the ones who already called",
              ].map((t) => (
                <li key={t}>
                  <span className="c04-not-x" aria-hidden="true">
                    ✕
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ final cta -- */

function FinalCta() {
  return (
    <section className="c04-final c04-grained" data-nav="dark" aria-labelledby="c04-final-title">
      <div className="c04-wrap">
        <h2 id="c04-final-title" data-split>
          Watch it once. <span className="c04-dim">Then decide.</span>
        </h2>
        <p className="c04-lede" data-reveal>
          Five minutes to see exactly what gets recovered, then a fifteen-minute call to find out whether your shop is a
          fit. Nothing to sign either way.
        </p>
        <div className="c04-cta-row" data-reveal>
          <Link href="/demo" className="c04-btn c04-btn--lg">
            Watch the 5-min demo <Arrow />
          </Link>
        </div>
        <p className="c04-fine" data-reveal>
          No self-serve signup. Reply to the email that sent you here and we&apos;ll set up the call.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- footer --- */

function Footer() {
  return (
    <footer className="c04-footer">
      <div className="c04-wrap c04-footer-in">
        <div>
          <span className="c04-brand" style={{ minHeight: 0 }}>
            <span className="c04-brand-mark" aria-hidden="true">
              <i />
              <i />
            </span>
            {BUSINESS_NAME}
          </span>
          <p>Missed-call and dead-estimate recovery for HVAC shops in Greater Boston and eastern Massachusetts.</p>
        </div>
        <nav className="c04-footer-links" aria-label="Footer">
          <Link href="/demo">Demo</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/login">Admin</Link>
        </nav>
      </div>
    </footer>
  );
}
