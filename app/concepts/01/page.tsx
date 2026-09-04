import Link from "next/link";
import type { Metadata } from "next";
import { BUSINESS_NAME } from "@/lib/business";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Reveal } from "./Reveal";
import { Count } from "./Count";
import { HourBar } from "./HourBar";
import { Scenarios } from "./Scenarios";
import { Calculator } from "./Calculator";
import { Faq } from "./Faq";
import { Parallax } from "./Parallax";
import { HouseNight, QuoteSheet, VanDawn } from "./Illustrations";

export const metadata: Metadata = {
  title: `${BUSINESS_NAME} — the 9:14 pm call, back on your schedule`,
  description:
    "Missed-call and dead-estimate recovery for HVAC shops in Greater Boston and eastern Massachusetts. The after-hours call gets a text back in seconds; the quiet estimate gets a second touch. $2,500 setup, $750 a month from go-live.",
};

export default function Concept01Page() {
  return (
    <>
      <Nav />
      <main id="c1-main">
        <Hero />
        <Proof />
        <TheGap />
        <TwoLeaks />
        <OneNight />
        <HowItWorks />
        <YourNumbers />
        <WhatThisIsNot />
        <Pricing />
        <Questions />
        <WhoItsFor />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

/* ------------------------------------------------------------- shared --- */

function Head({
  eyebrow,
  title,
  lede,
  tone = "light",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={`c1-head ${tone === "dark" ? "c1-head--dark" : ""}`}>
      <p className="c1-eyebrow" data-rise>
        {eyebrow}
      </p>
      <h2 className="c1-h2" data-split>
        {title}
      </h2>
      {lede ? (
        <p className="c1-lede" data-rise>
          {lede}
        </p>
      ) : null}
    </div>
  );
}

function Tick({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`c1-tick ${className}`}
    >
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

function Cross() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className="c1-cross"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

/* -------------------------------------------------------------- proof --- */

function Proof() {
  return (
    <Reveal className="c1-proof-band" aria-label="At a glance">
      <div className="c1-wrap">
        <ul className="c1-proof">
          <li className="c1-proof-item" data-rise>
            <div className="c1-proof-k">
              <Count value={4} suffix=" seconds" />
            </div>
            <div className="c1-proof-v">from a missed call to a text back from your number</div>
          </li>
          <li className="c1-proof-item" data-rise>
            <div className="c1-proof-k">
              <Count value={15} suffix=" hours" />
            </div>
            <div className="c1-proof-v">a weekday your line rings out, once the desk is empty</div>
          </li>
          <li className="c1-proof-item" data-rise>
            <div className="c1-proof-k">Days, not months</div>
            <div className="c1-proof-v">from the setup fee clearing to live on your line</div>
          </li>
          <li className="c1-proof-item" data-rise>
            <div className="c1-proof-k">$0 until live</div>
            <div className="c1-proof-v">the monthly starts the day it goes live, not at signing</div>
          </li>
        </ul>
      </div>
    </Reveal>
  );
}

/* ---------------------------------------------------------------- gap --- */

function TheGap() {
  return (
    <Reveal className="c1-section" id="gap">
      <div className="c1-wrap">
        <Head
          eyebrow="The gap"
          title={
            <>
              Your office is open nine hours. <em>Your phone isn&apos;t.</em>
            </>
          }
          lede="Furnaces don't fail on a schedule. Neither do the calls. Everything in the dark band is a call your team has to catch later — or never hears about."
        />
        <div className="c1-gapcard" data-rise>
          <HourBar />
          <div className="c1-stats">
            <div className="c1-stat">
              <div className="c1-stat-k c1-stat-k--open">9 hours</div>
              <div className="c1-stat-v">Someone is at the desk. Most of those calls get answered.</div>
            </div>
            <div className="c1-stat">
              <div className="c1-stat-k c1-stat-k--lost">
                <Count value={15} suffix=" hours" />
              </div>
              <div className="c1-stat-v">Rings out, every weekday. No voicemail from most of them.</div>
            </div>
            <div className="c1-stat">
              <div className="c1-stat-k c1-stat-k--lost">All weekend</div>
              <div className="c1-stat-v">Plus holidays, storm days, and the first cold snap of the year.</div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* -------------------------------------------------------------- leaks --- */

function TwoLeaks() {
  return (
    <Reveal className="c1-section c1-section--tint" id="leaks">
      <div className="c1-wrap">
        <Head
          eyebrow="What gets recovered"
          title={
            <>
              Two leaks. <em>Both fixable.</em>
            </>
          }
          lede="This is not lead generation. We're not buying you new customers. We're keeping the ones who already called you."
        />
        <div className="c1-leaks">
          <article className="c1-leak" data-rise>
            <div className="c1-leak-art">
              <HouseNight className="c1-leak-svg" />
            </div>
            <div className="c1-leak-body">
              <div className="c1-eyebrow c1-eyebrow--muted">Leak 01</div>
              <h3 className="c1-h3">The call nobody answered</h3>
              <p>
                Nights, weekends, storm days, and every hour your office manager is already on
                another line. The customer doesn&apos;t leave a voicemail. They hang up and call the
                next shop.
              </p>
              <ul className="c1-points">
                <li>
                  <Tick className="c1-tick--good" /> The missed call gets a text back from your number
                  within seconds, not the next morning
                </li>
                <li>
                  <Tick className="c1-tick--good" /> No heat, no water, no AC in a heat wave — those
                  get flagged as urgent, not queued
                </li>
                <li>
                  <Tick className="c1-tick--good" /> The customer picks a callback window instead of
                  picking your competitor
                </li>
              </ul>
            </div>
          </article>

          <article className="c1-leak" data-rise>
            <div className="c1-leak-art c1-leak-art--paper">
              <QuoteSheet className="c1-leak-svg" />
            </div>
            <div className="c1-leak-body">
              <div className="c1-eyebrow c1-eyebrow--muted">Leak 02</div>
              <h3 className="c1-h3">The estimate that went quiet</h3>
              <p>
                You quoted a system replacement three weeks ago. They didn&apos;t say no. They just
                never replied, and nobody in the shop had an afternoon free to chase it.
              </p>
              <ul className="c1-points">
                <li>
                  <Tick className="c1-tick--good" /> A check-in a few days after the quote goes out
                </li>
                <li>
                  <Tick className="c1-tick--good" /> A second touch before it goes cold for good
                </li>
                <li>
                  <Tick className="c1-tick--good" /> You hear a yes, a no, or an objection you can
                  actually answer
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------------------------------------------------- one night --- */

function OneNight() {
  return (
    <Reveal className="c1-section" id="night">
      <div className="c1-wrap">
        <Head
          eyebrow="One Tuesday, after close"
          title={
            <>
              Three calls nobody was there for. <em>Same night, different ending.</em>
            </>
          }
          lede="An illustration of a night, not a claim. Real people say things like this at 9 pm. The question is only whether they hear back."
        />
        <Scenarios />
        <p className="c1-fineprint" data-rise>
          Recovered calls and replies land back with your team the way any booked job does. A
          weekly recap shows what came back.
        </p>
      </div>
    </Reveal>
  );
}

/* ---------------------------------------------------------------- how --- */

const STEPS = [
  {
    n: "01",
    t: "We look at how calls reach you now",
    d: "One short call. Your main line, who answers it, what happens after 5 pm, and how estimates go out today. Nothing gets ripped out.",
  },
  {
    n: "02",
    t: "We set it up around your shop",
    d: "Built on our side to your hours, your service area, and how you want urgent jobs handled. Your techs install nothing.",
  },
  {
    n: "03",
    t: "We test it with you before it's live",
    d: "We run real calls through it together. You hear exactly what a customer hears before a single one reaches it.",
  },
  {
    n: "04",
    t: "It runs, and you get the recap",
    d: "Recovered calls and estimate replies land with your team like any booked job. A weekly recap shows what came back.",
  },
];

function HowItWorks() {
  return (
    <Reveal className="c1-section c1-section--tint" id="how">
      <div className="c1-wrap">
        <div className="c1-how">
          <div className="c1-how-copy">
            <Head
              eyebrow="How it works"
              title={
                <>
                  Four steps. <em>You do almost none of them.</em>
                </>
              }
              lede="Setup is on us, in days. The only thing we need from you is one call and a few answers."
            />
            <ol className="c1-steps">
              {STEPS.map((s) => (
                <li key={s.n} className="c1-step" data-rise>
                  <span className="c1-step-n c1-mono">{s.n}</span>
                  <div>
                    <h3 className="c1-h3 c1-h3--sm">{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="c1-how-art" data-rise>
            <Parallax className="c1-van" amount={10}>
              <VanDawn className="c1-van-svg" />
            </Parallax>
            <p className="c1-art-cap">
              The morning after. The 9:14 pm call is the first stop, and it works alongside whatever
              answering service or scheduling you already run.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------ numbers --- */

function YourNumbers() {
  return (
    <Reveal className="c1-section" id="numbers">
      <div className="c1-wrap">
        <Head
          eyebrow="Run your own numbers"
          title={
            <>
              One recovered job is <em>the whole conversation.</em>
            </>
          }
          lede="Don't take our figures — there aren't any. Put in what a job is worth at your shop and the math answers itself."
        />
        <div data-rise>
          <Calculator />
        </div>
      </div>
    </Reveal>
  );
}

/* --------------------------------------------------------------- isn't --- */

const NOTS = [
  { t: "Not an answering service", d: "Nobody is sitting in a room pretending to be your front desk. If you have one, keep it — this catches what falls through anyway." },
  { t: "Not a new CRM", d: "Whatever you run jobs with today, you keep. Recovered jobs land there like any other booked job." },
  { t: "Not an app for your techs", d: "Nothing to install, nothing to log into, no training day on the truck." },
  { t: "Not a marketing retainer", d: "We're not buying ads or writing blog posts. This is recovery, not acquisition." },
  { t: "Not a long contract", d: "Month to month. Stop the day it stops paying for itself." },
  { t: "Not sold as “AI”", d: "You're buying recovered jobs — missed night calls and dead estimates. How it's built is our problem, not your pitch." },
];

function WhatThisIsNot() {
  return (
    <Reveal className="c1-section c1-section--tint" id="not">
      <div className="c1-wrap">
        <Head
          eyebrow="Straight answers"
          title={
            <>
              What this <em>isn&apos;t.</em>
            </>
          }
          lede="You've been pitched before. Here's what we're not asking you to sign up for."
        />
        <ul className="c1-nots">
          {NOTS.map((n) => (
            <li key={n.t} className="c1-not" data-rise>
              <h3 className="c1-h3 c1-h3--sm">
                <Cross /> {n.t}
              </h3>
              <p>{n.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------- pricing --- */

function Pricing() {
  return (
    <Reveal className="c1-section" id="pricing">
      <div className="c1-wrap">
        <Head
          eyebrow="Pricing"
          title={
            <>
              Two numbers. <em>No surprises.</em>
            </>
          }
          lede="Setup is paid in full before we start work. The monthly doesn't begin until your system is actually live."
        />
        <div className="c1-price" data-rise>
          <div className="c1-price-head">
            <span className="c1-eyebrow c1-eyebrow--muted">Work order — recovery setup</span>
            <span className="c1-mono">No. 0001</span>
          </div>
          <div className="c1-price-grid">
            <div className="c1-price-cell">
              <div className="c1-eyebrow c1-eyebrow--muted">One-time setup</div>
              <div className="c1-amt">
                <Count value={2500} prefix="$" />
              </div>
              <p>
                Paid in full before any work starts. Covers the build, the configuration around
                your shop, and testing it with you until it&apos;s right.
              </p>
            </div>
            <div className="c1-price-cell">
              <div className="c1-eyebrow c1-eyebrow--muted">Then, monthly</div>
              <div className="c1-amt c1-amt--mo">
                <Count value={750} prefix="$" />
                <span className="c1-amt-unit">/month</span>
              </div>
              <p>
                Starts the day your system goes live — never the day you sign. Running it,
                watching it, and the weekly recap. Cancel any time.
              </p>
            </div>
          </div>

          <ol className="c1-timeline" aria-label="When you pay">
            <li className="c1-tl-step">
              <span className="c1-tl-dot" aria-hidden="true" />
              <b>Day 0</b>
              <span>Setup fee clears. We start.</span>
            </li>
            <li className="c1-tl-step">
              <span className="c1-tl-dot" aria-hidden="true" />
              <b>Days, not months</b>
              <span>Built and tested with you. Nothing billed.</span>
            </li>
            <li className="c1-tl-step c1-tl-step--live">
              <span className="c1-tl-dot" aria-hidden="true" />
              <b>Go-live</b>
              <span>The $750 monthly starts today, not before.</span>
            </li>
            <li className="c1-tl-step">
              <span className="c1-tl-dot" aria-hidden="true" />
              <b>Any month</b>
              <span>Cancel. No long contract.</span>
            </li>
          </ol>

          <div className="c1-price-foot">
            <p>
              No revenue share. No per-call fee. No setup on net-30 — we don&apos;t start until the
              setup fee clears, and you don&apos;t pay a monthly until it&apos;s running.
            </p>
            <Link href="/demo" className="c1-btn">
              Watch the demo first
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ----------------------------------------------------------------- faq --- */

function Questions() {
  return (
    <Reveal className="c1-section c1-section--tint" id="faq">
      <div className="c1-wrap c1-wrap--narrow">
        <Head
          eyebrow="Questions"
          title={
            <>
              The ones we <em>actually get.</em>
            </>
          }
        />
        <Faq />
      </div>
    </Reveal>
  );
}

/* ---------------------------------------------------------------- who --- */

function WhoItsFor() {
  return (
    <Reveal className="c1-section" id="fit">
      <div className="c1-wrap">
        <Head
          eyebrow="Fit"
          title={
            <>
              Who this is <em>built for.</em>
            </>
          }
          lede="We'd rather say no on the 15-minute call than take a setup fee from a shop this won't help."
        />
        <div className="c1-fit">
          <div className="c1-fit-card c1-fit-card--yes" data-rise>
            <div className="c1-eyebrow">A fit</div>
            <ul>
              {[
                "HVAC shops running roughly 5 to 30 trucks",
                "Greater Boston and eastern Massachusetts",
                "Your phone rings after hours and nobody's on it",
                "You send written estimates and some go quiet",
                "You already have an answering service and still lose calls",
              ].map((t) => (
                <li key={t}>
                  <Tick className="c1-tick--good" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="c1-fit-card" data-rise>
            <div className="c1-eyebrow c1-eyebrow--muted">Not a fit</div>
            <ul>
              {[
                "One-truck operations — the math doesn't work yet",
                "Shops already staffing a 24/7 dispatch desk",
                "Anyone outside eastern MA, for now",
                "Looking for new leads rather than keeping the ones you have",
              ].map((t) => (
                <li key={t}>
                  <Cross />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------------------------------------------------- final cta --- */

function FinalCta() {
  return (
    <Reveal className="c1-final c1-night" id="cta">
      <Parallax className="c1-final-art" amount={8}>
        <HouseNight className="c1-final-svg" />
      </Parallax>
      <div className="c1-wrap c1-final-inner">
        <p className="c1-eyebrow c1-eyebrow--onnight" data-rise>
          Tonight, around 9 pm
        </p>
        <h2 className="c1-h2 c1-h2--big" data-split>
          Watch it once. <em>Then decide.</em>
        </h2>
        <p className="c1-lede c1-lede--onnight" data-rise>
          Five minutes to see exactly what gets recovered, then a fifteen-minute call to find out
          whether your shop is a fit. Nothing to sign either way.
        </p>
        <div className="c1-cta-row c1-cta-row--center" data-rise>
          <Link href="/demo" className="c1-btn c1-btn--lg">
            Watch the 5-min demo
          </Link>
        </div>
        <p className="c1-final-note" data-rise>
          No self-serve signup — reply to the email that sent you here.
        </p>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------- footer --- */

function Footer() {
  return (
    <footer className="c1-footer">
      <div className="c1-wrap c1-footer-inner">
        <div>
          <div className="c1-footer-brand">{BUSINESS_NAME}</div>
          <p className="c1-footer-desc">
            Missed-call and dead-estimate recovery for HVAC shops in Greater Boston and eastern
            Massachusetts.
          </p>
        </div>
        <nav className="c1-footer-links" aria-label="Footer">
          <Link href="/demo">Demo</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/login">Admin</Link>
        </nav>
      </div>
    </footer>
  );
}
