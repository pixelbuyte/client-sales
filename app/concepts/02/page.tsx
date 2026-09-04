import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BUSINESS_NAME } from "@/lib/business";
import { Hero } from "./Hero";
import { PageMotion } from "./PageMotion";
import { DayBar } from "./DayBar";
import { Filmstrip } from "./Filmstrip";
import { Calculator } from "./Calculator";
import { Faq } from "./Faq";
import { MagneticLink } from "./MagneticLink";
import { PhoneText, PaperEstimate, ServiceVan, Tick, Cross } from "./Illustrations";

export const metadata = {
  title: `${BUSINESS_NAME} — the 9:14 pm call, back on your board`,
  description:
    "Missed-call and dead-estimate recovery for HVAC shops in Greater Boston and eastern Massachusetts. The after-hours call and the quiet estimate, turned back into booked jobs.",
};

export default function Concept02Page() {
  return (
    <>
      <PageMotion />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <TheGap />
        <TwoLeaks />
        <Filmstrip />
        <HowItWorks />
        <RunYourNumbers />
        <WhatThisIsnt />
        <Pricing />
        <Questions />
        <WhoItsFor />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

/* ---------------------------------------------------------------- nav --- */

function Nav() {
  return (
    <header className="c02-nav">
      <div className="c02-wrap c02-nav-inner">
        <Link href="/concepts/02" className="c02-brand" aria-label={`${BUSINESS_NAME} home`}>
          <span className="c02-brand-mark" aria-hidden="true">
            a
          </span>
          <span className="c02-brand-name">{BUSINESS_NAME}</span>
        </Link>
        <nav className="c02-nav-links" aria-label="Page">
          <a href="#how" className="c02-nav-link">
            How it works
          </a>
          <a href="#numbers" className="c02-nav-link">
            Your numbers
          </a>
          <a href="#pricing" className="c02-nav-link">
            Pricing
          </a>
          <a href="#faq" className="c02-nav-link">
            Questions
          </a>
          <MagneticLink href="/demo" className="c02-btn c02-btn-sm">
            Watch the 5-min demo
          </MagneticLink>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------ marquee --- */

const TOWNS = [
  "Quincy", "Weymouth", "Braintree", "Milton", "Dedham", "Norwood", "Brockton", "Plymouth",
  "Waltham", "Newton", "Medford", "Somerville", "Cambridge", "Lynn", "Salem", "Peabody",
  "Framingham", "Marshfield", "Hingham", "Randolph",
];

function Marquee() {
  const group = (
    <>
      <span>Serving</span>
      {TOWNS.map((t) => (
        <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 28 }}>
          <i aria-hidden="true" />
          {t}
        </span>
      ))}
    </>
  );
  return (
    <div className="c02-marquee" aria-label={`Serving ${TOWNS.join(", ")}`}>
      <div className="c02-marquee-track" aria-hidden="true">
        <div className="c02-marquee-group">{group}</div>
        <div className="c02-marquee-group">{group}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- shared --- */

function SectionHead({
  num,
  eyebrow,
  title,
  lede,
  id,
}: {
  num: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  id: string;
}) {
  return (
    <div className="c02-sechead">
      <div className="c02-num" aria-hidden="true">
        {num}
      </div>
      <div className="c02-sechead-body">
        <p className="c02-eyebrow">
          <span className="c02-rule" aria-hidden="true" />
          <span>{eyebrow}</span>
        </p>
        <h2 id={id} className="c02-h2" data-split>
          {title}
        </h2>
        {lede ? (
          <p className="c02-lede" data-reveal>
            {lede}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- gap --- */

function TheGap() {
  return (
    <section className="c02-section" aria-labelledby="c02-gap-title">
      <div className="c02-wrap">
        <SectionHead
          num="01"
          id="c02-gap-title"
          eyebrow="The gap"
          title={
            <>
              Your office is open nine hours. <em>Your phone isn&apos;t.</em>
            </>
          }
          lede="Furnaces don't fail on a schedule, and neither do the calls. Everything in the dark band is a call your team has to catch later — or doesn't catch at all."
        />
        <div className="c02-gap-grid">
          <DayBar />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- leaks --- */

function TwoLeaks() {
  return (
    <section className="c02-section" aria-labelledby="c02-leaks-title">
      <div className="c02-wrap">
        <SectionHead
          num="02"
          id="c02-leaks-title"
          eyebrow="What gets recovered"
          title={
            <>
              Two leaks. <em>Both fixable.</em>
            </>
          }
          lede="This isn't lead generation. We're not buying you new customers. We're keeping the ones who already picked up the phone and called you."
        />

        <div className="c02-leak" data-reveal>
          <div className="c02-leak-copy">
            <div className="c02-leak-index" data-r>
              Leak 01
            </div>
            <h3 className="c02-h3" data-r>
              The call nobody answered
            </h3>
            <p className="c02-body" data-r>
              Nights, weekends, storm days, and every hour your office manager is on another
              line. The customer doesn&apos;t leave a voicemail. They hang up and call the next
              shop.
            </p>
            <ul className="c02-points">
              <li data-r>
                <Tick />
                <span>A missed call gets a text back within seconds, not the next morning.</span>
              </li>
              <li data-r>
                <Tick />
                <span>Urgent jobs — no heat, no AC in a heat wave, water where it shouldn&apos;t be — get flagged, not queued.</span>
              </li>
              <li data-r>
                <Tick />
                <span>The customer picks a callback window instead of picking your competitor.</span>
              </li>
            </ul>
          </div>
          <div className="c02-leak-art" data-parallax="6">
            <div className="c02-art" data-develop>
              <PhoneText />
            </div>
          </div>
        </div>

        <div className="c02-leak is-flip" data-reveal>
          <div className="c02-leak-copy">
            <div className="c02-leak-index" data-r>
              Leak 02
            </div>
            <h3 className="c02-h3" data-r>
              The estimate that went quiet
            </h3>
            <p className="c02-body" data-r>
              You quoted a system replacement three weeks ago. They didn&apos;t say no. They just
              never replied, and nobody in the shop had an afternoon free to chase it.
            </p>
            <ul className="c02-points">
              <li data-r>
                <Tick />
                <span>A check-in goes out a few days after the quote, in your name.</span>
              </li>
              <li data-r>
                <Tick />
                <span>A second touch before it goes cold for good.</span>
              </li>
              <li data-r>
                <Tick />
                <span>You hear a yes, a no, or an objection you can actually answer.</span>
              </li>
            </ul>
          </div>
          <div className="c02-leak-art" data-parallax="6">
            <div className="c02-art" data-develop>
              <PaperEstimate />
            </div>
          </div>
        </div>

        <blockquote className="c02-pull" data-reveal>
          <p className="c02-pull-q">
            &ldquo;No heat and we have a newborn here.&rdquo;
          </p>
          <p className="c02-pull-by">
            Marcus T. · Weymouth · 11:41 pm — <b>flagged urgent, not queued</b>
          </p>
        </blockquote>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- how --- */

const STEPS = [
  {
    n: "1",
    t: "We look at how calls reach you now",
    d: "One short call. Your main line, who answers it, what happens after 5 pm, and how estimates go out today. Nothing gets ripped out.",
    tag: "20 minutes of your time",
  },
  {
    n: "2",
    t: "We set it up around your shop",
    d: "Built on our side to your hours, your service area, and how you want urgent jobs handled. Your techs install nothing. Your number doesn't change.",
    tag: "Days, not months",
  },
  {
    n: "3",
    t: "We test it with you before it's live",
    d: "We run real calls through it together. You hear exactly what a customer hears before a single one of yours reaches it.",
    tag: "You sign off on go-live",
  },
  {
    n: "4",
    t: "It runs, and you get the recap",
    d: "Recovered calls and estimate replies land with your team the way any booked job does. A weekly recap shows what came back.",
    tag: "Monthly starts here",
  },
];

function HowItWorks() {
  return (
    <section className="c02-section" id="how" aria-labelledby="c02-how-title">
      <div className="c02-wrap">
        <SectionHead
          num="04"
          id="c02-how-title"
          eyebrow="How it works"
          title={
            <>
              Four steps. <em>You do almost none of them.</em>
            </>
          }
          lede="Setup is on us. The only things we need from you are one call and a couple of straight answers."
        />
        <div className="c02-how-grid">
          <ol className="c02-steps" data-reveal>
            {STEPS.map((s) => (
              <li key={s.n} className="c02-step" data-r>
                <div className="c02-step-n" aria-hidden="true">
                  {s.n}
                </div>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  <span className="c02-step-tag">{s.tag}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="c02-how-art" data-parallax="5">
            <div className="c02-art" data-develop>
              <ServiceVan />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- numbers --- */

function RunYourNumbers() {
  return (
    <section className="c02-section" id="numbers" aria-labelledby="c02-numbers-title">
      <div className="c02-wrap">
        <SectionHead
          num="05"
          id="c02-numbers-title"
          eyebrow="Run your numbers"
          title={
            <>
              One recovered job is <em>the whole conversation.</em>
            </>
          }
          lede="Don't take our figures — we don't have yours. Type in what a job is actually worth at your shop and let the math answer itself."
        />
        <div data-reveal>
          <Calculator />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- isn't --- */

const NOTS = [
  { t: "Not an answering service", d: "Nobody is sitting in a room pretending to be your front desk. If you have one, keep it — this catches what falls through anyway." },
  { t: "Not a new CRM", d: "Whatever you run jobs with today, you keep. Recovered work lands there like any other booked job." },
  { t: "Not something your techs install", d: "No login, no training day, no new process on the truck." },
  { t: "Not a marketing retainer", d: "We're not buying ads or writing blog posts. This is recovery, not acquisition." },
  { t: "Not a long contract", d: "Month to month. Stop the day it stops paying for itself." },
  { t: "Not sold as “AI”", d: "You're buying recovered jobs. How it's built is our problem, not your pitch." },
];

function WhatThisIsnt() {
  return (
    <section className="c02-section" aria-labelledby="c02-not-title">
      <div className="c02-wrap">
        <SectionHead
          num="06"
          id="c02-not-title"
          eyebrow="Straight answers"
          title={
            <>
              What this <em>isn&apos;t.</em>
            </>
          }
          lede="You've been pitched before. Here's what we're not asking you to sign up for."
        />
        <div className="c02-nots">
          <ul className="c02-nots-list" data-reveal>
            {NOTS.map((n) => (
              <li key={n.t} className="c02-not" data-r>
                <span className="c02-not-x" aria-hidden="true">
                  ×
                </span>
                <div>
                  <h3>{n.t}</h3>
                  <p>{n.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <aside className="c02-nots-aside" data-reveal>
            <div className="c02-pull" style={{ margin: 0, transform: "rotate(1deg)" }}>
              <p className="c02-pull-q">What it is: the 9:14 call, and the quiet estimate, back on your board.</p>
              <p className="c02-pull-by">That&apos;s the whole product</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- pricing --- */

function Pricing() {
  return (
    <section className="c02-section" id="pricing" aria-labelledby="c02-pricing-title">
      <div className="c02-wrap">
        <SectionHead
          num="07"
          id="c02-pricing-title"
          eyebrow="Pricing"
          title={
            <>
              Two numbers. <em>No surprises.</em>
            </>
          }
          lede="Setup is paid in full before we start work. The monthly doesn't begin until your system is actually live — never at signing."
        />
        <div className="c02-price-grid" data-reveal>
          <div className="c02-workorder" data-r>
            <div className="c02-wo-head">
              <span>Work order — recovery setup</span>
              <span>No. 0001</span>
            </div>
            <div className="c02-wo-body">
              <div className="c02-wo-cell">
                <div className="c02-wo-label">One-time setup</div>
                <div className="c02-wo-price">$2,500</div>
                <p className="c02-wo-desc">
                  <b>Paid in full before any work starts.</b> Covers the build, the configuration
                  around your shop, and testing it with you until it&apos;s right.
                </p>
              </div>
              <div className="c02-wo-cell">
                <div className="c02-wo-label">Then, monthly</div>
                <div className="c02-wo-price is-monthly">
                  $750<small>/ mo</small>
                </div>
                <p className="c02-wo-desc">
                  <b>Starts the day your system goes live.</b> Not the day you sign. Running it,
                  watching it, and the weekly recap. Month to month.
                </p>
              </div>
            </div>

            <div className="c02-golive">
              <div className="c02-wo-label">When the money moves</div>
              <div className="c02-golive-line" aria-hidden="true">
                <div className="c02-golive-fill" data-draw />
              </div>
              <div className="c02-golive-marks">
                <div className="c02-golive-mark">
                  <b>Day 0 — setup paid</b>
                  <span>$2,500, in full. Work starts once it clears.</span>
                </div>
                <div className="c02-golive-mark">
                  <b>Build and test with you</b>
                  <span>Days, not months. $0 monthly during this stretch.</span>
                </div>
                <div className="c02-golive-mark is-live">
                  <b>Go-live day — $750/mo starts</b>
                  <span>Not one day earlier. Cancel any time after.</span>
                </div>
              </div>
            </div>

            <div className="c02-wo-foot">
              <ul>
                {["No revenue share", "No per-call fee", "No long contract", "Cancel any time"].map((t) => (
                  <li key={t}>
                    <Tick size={14} />
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/demo" className="c02-btn-ghost">
                Watch the demo first
                <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
              </Link>
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
    <section className="c02-section" id="faq" aria-labelledby="c02-faq-title">
      <div className="c02-wrap">
        <SectionHead
          num="08"
          id="c02-faq-title"
          eyebrow="Questions"
          title={
            <>
              The ones we <em>actually get.</em>
            </>
          }
        />
        <div className="c02-faq-grid" data-reveal>
          <Faq />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- fit --- */

function WhoItsFor() {
  return (
    <section className="c02-section" aria-labelledby="c02-fit-title">
      <div className="c02-wrap">
        <SectionHead
          num="09"
          id="c02-fit-title"
          eyebrow="Fit"
          title={
            <>
              Who this is <em>built for.</em>
            </>
          }
          lede="We'd rather say no on the call than take a setup fee from a shop this won't help."
        />
        <div className="c02-fit" data-reveal>
          <div className="c02-fit-card is-yes" data-r>
            <h3>A fit</h3>
            <ul>
              {[
                "HVAC shops running roughly 5 to 30 trucks",
                "Greater Boston and eastern Massachusetts",
                "Your phone rings after hours and nobody's on it",
                "You send written estimates and some of them go quiet",
                "You already have an answering service and still lose calls",
              ].map((t) => (
                <li key={t}>
                  <Tick />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="c02-fit-card is-no" data-r>
            <h3>Not a fit</h3>
            <ul>
              {[
                "One-truck operations — the math doesn't work yet",
                "Shops already staffing a 24/7 dispatch desk",
                "Anyone outside eastern Massachusetts, for now",
                "Looking for new leads rather than keeping the ones you have",
              ].map((t) => (
                <li key={t}>
                  <Cross />
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
    <section className="c02-final" aria-labelledby="c02-final-title">
      <div className="c02-final-art" aria-hidden="true">
        <ServiceVan tone="paper" />
      </div>
      <div className="c02-wrap">
        <div className="c02-final-inner" data-reveal>
          <h2 id="c02-final-title" data-split>
            Watch it once. <em>Then decide.</em>
          </h2>
          <p data-r>
            Five minutes to see exactly what gets recovered, then a fifteen-minute call to find out
            whether your shop is a fit. Nothing to sign either way.
          </p>
          <div className="c02-final-cta" data-r>
            <MagneticLink href="/demo" className="c02-btn">
              Watch the 5-min demo
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </MagneticLink>
            <span className="c02-final-note">
              No self-serve signup — reply to the email that sent you here.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- footer --- */

function Footer() {
  return (
    <footer className="c02-footer">
      <div className="c02-wrap c02-footer-inner">
        <div>
          <div className="c02-footer-brand">{BUSINESS_NAME}</div>
          <p>
            Missed-call and dead-estimate recovery for HVAC shops in Greater Boston and eastern
            Massachusetts.
          </p>
        </div>
        <nav aria-label="Footer">
          <Link href="/demo">Demo</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/login">Admin</Link>
        </nav>
      </div>
    </footer>
  );
}
