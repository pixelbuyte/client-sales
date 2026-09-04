import Link from "next/link";
import { ArrowRight, PhoneMissed, Wrench, ClipboardCheck, Radio, AlertTriangle } from "lucide-react";
import { BUSINESS_NAME } from "@/lib/business";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { WeekBoard } from "./WeekBoard";
import { Calculator } from "./Calculator";
import { Faq } from "./Faq";
import { PageMotion } from "./PageMotion";
import { Tick, Cross, MarkerX, Magnet, Van, Houses, WallClock, PhoneScene, EstimateScene } from "./Illustrations";

export const metadata = {
  title: `${BUSINESS_NAME} — the 9:14 pm call, back on your board by morning`,
  description:
    "Missed-call and dead-estimate recovery for HVAC shops in Greater Boston and eastern Massachusetts. The after-hours call and the quiet estimate, turned back into booked jobs.",
};

export default function Concept03Page() {
  return (
    <>
      <PageMotion />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <TheGap />
        <TwoLeaks />
        <HowItWorks />
        <WeekBoard />
        <YourNumbers />
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
    <header className="c03-nav">
      <div className="c03-wrap c03-nav-inner">
        <Link href="/concepts/03" className="c03-brand" aria-label={`${BUSINESS_NAME} home`}>
          <span className="c03-brand-mark" aria-hidden="true">
            A
          </span>
          <span className="c03-brand-name">{BUSINESS_NAME}</span>
        </Link>
        <nav className="c03-nav-links" aria-label="Page">
          <a href="#gap" className="c03-nav-link">
            The gap
          </a>
          <a href="#how" className="c03-nav-link">
            How it works
          </a>
          <a href="#numbers" className="c03-nav-link">
            Your numbers
          </a>
          <a href="#pricing" className="c03-nav-link">
            Pricing
          </a>
          <a href="#faq" className="c03-nav-link">
            Questions
          </a>
        </nav>
        <Link href="/demo" className="c03-btn c03-btn-cta">
          Watch the 5-min demo
        </Link>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- gap --- */

const HOURS = [
  "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p",
  "6p", "7p", "8p", "9p", "10p", "11p", "12a", "1a", "2a", "3a", "4a", "5a",
];
const OPEN = new Set(["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p"]);

function TheGap() {
  return (
    <section id="gap" className="c03-paper c03-section" aria-labelledby="c03-gap-title">
      <div className="c03-wrap">
        <div className="c03-gap-grid">
          <div>
            <p className="c03-eyebrow">the gap</p>
            <h2 id="c03-gap-title" className="c03-h2" data-split>
              Your office is open nine hours. Your phone isn&apos;t.
            </h2>
            <p className="c03-lede">
              Furnaces don&apos;t fail on a schedule, and neither do the calls. Everything in the
              dark band is a call your team has to catch later — or not at all. Most of them
              don&apos;t leave a voicemail. They hang up and call the next shop in the search results.
            </p>
            <div className="c03-gap-callout" data-reveal>
              <AlertTriangle aria-hidden="true" />
              <strong>the 9:14 pm call</strong>
              Fifteen hours a weekday, two full days a weekend, every storm. That&apos;s where the
              no-heat calls live — the ones that pay the best and forgive the least.
            </div>
          </div>

          <div className="c03-dayboard" data-reveal>
            <div className="c03-note">a weekday, hour by hour</div>
            <div className="c03-hours" data-hours role="img" aria-label="A 24 hour strip: the office is open from 8am to 5pm; the other 15 hours ring out.">
              {HOURS.map((h) => (
                <div key={h} className={`c03-hour ${OPEN.has(h) ? "c03-hour-open" : "c03-hour-closed"}`} />
              ))}
            </div>
            <div className="c03-hours-labels" aria-hidden="true">
              {HOURS.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            <div className="c03-hours-legend" aria-hidden="true">
              <span>
                <i style={{ background: "#1e5f8c" }} />
                someone at the desk
              </span>
              <span>
                <i style={{ background: "#0c2a45" }} />
                rings out
              </span>
            </div>
            <div className="c03-stat-row">
              <div>
                <div className="c03-stat-k is-open">9 hrs</div>
                <div className="c03-stat-v">Someone is at the desk</div>
              </div>
              <div>
                <div className="c03-stat-k is-lost">15 hrs</div>
                <div className="c03-stat-v">Rings out, every weekday</div>
              </div>
              <div>
                <div className="c03-stat-k is-lost">All weekend</div>
                <div className="c03-stat-v">Plus holidays and storm days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- leaks --- */

function TwoLeaks() {
  return (
    <section id="leaks" className="c03-board c03-section" aria-labelledby="c03-leaks-title">
      <div className="c03-wrap">
        <div className="c03-head">
          <p className="c03-eyebrow">what gets recovered</p>
          <h2 id="c03-leaks-title" className="c03-h2" data-split>
            Two leaks. Both fixable.
          </h2>
          <p className="c03-lede">
            This isn&apos;t lead generation. We&apos;re not buying you new customers — we&apos;re
            keeping the ones who already called you, and the ones you already quoted.
          </p>
        </div>

        <div className="c03-leaks" data-reveal-group>
          <article className="c03-leak">
            <Magnet className="c03-magnet" />
            <div className="c03-leak-index">
              <i aria-hidden="true" />
              Leak 01
            </div>
            <h3>The call nobody answered</h3>
            <p className="c03-leak-body">
              Nights, weekends, storm days, and every hour your office manager is already on
              another line. The customer doesn&apos;t leave a voicemail. They hang up and call the
              next shop.
            </p>
            <ul className="c03-leak-points">
              <li>
                <Tick />
                The missed call gets a text back within seconds, not the next morning
              </li>
              <li>
                <Tick />
                Urgent jobs — no heat, no AC in a heat wave, water — get flagged, not queued
              </li>
              <li>
                <Tick />
                The customer picks a callback window instead of picking your competitor
              </li>
            </ul>
            <div className="c03-leak-scene">
              <PhoneScene />
            </div>
          </article>

          <article className="c03-leak">
            <Magnet className="c03-magnet" />
            <div className="c03-leak-index">
              <i aria-hidden="true" />
              Leak 02
            </div>
            <h3>The estimate that went quiet</h3>
            <p className="c03-leak-body">
              You quoted a system replacement three weeks ago. They didn&apos;t say no. They just
              never replied, and nobody in the shop had an afternoon free to chase it.
            </p>
            <ul className="c03-leak-points">
              <li>
                <Tick />A check-in a few days after the quote goes out
              </li>
              <li>
                <Tick />A second touch before it goes cold for good
              </li>
              <li>
                <Tick />
                You hear a yes, a no, or an objection you can actually answer
              </li>
            </ul>
            <div className="c03-leak-scene">
              <EstimateScene />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- how --- */

const STEPS = [
  {
    icon: PhoneMissed,
    t: "One short call",
    d: "Your main line, who answers it, what happens after 5 pm, and how estimates go out today. Nothing to rip out.",
    hand: "about 20 minutes",
  },
  {
    icon: Wrench,
    t: "We set it up around your shop",
    d: "Built on our side to your hours, your service area, and how you want urgent jobs handled. You don't install anything.",
    hand: "days, not months",
  },
  {
    icon: ClipboardCheck,
    t: "We test it with you before it's live",
    d: "We run real calls through it together. You hear exactly what a customer hears before a single one reaches it.",
    hand: "you sign off, not us",
  },
  {
    icon: Radio,
    t: "It runs. You get the recap.",
    d: "Recovered calls and estimate replies land with your team like any other booked job. A weekly recap shows what came back.",
    hand: "monthly starts here",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="c03-paper c03-section" aria-labelledby="c03-how-title">
      <div className="c03-wrap">
        <div className="c03-head">
          <p className="c03-eyebrow">how it works</p>
          <h2 id="c03-how-title" className="c03-h2" data-split>
            Four steps. You do almost none of them.
          </h2>
          <p className="c03-lede">
            Setup is on us. The only things we need from you are one call, a couple of answers, and
            your say-so before it goes live.
          </p>
        </div>

        <ol className="c03-steps" data-reveal-group>
          {STEPS.map((s, i) => (
            <li className="c03-step" key={s.t}>
              <span className="c03-step-n" aria-hidden="true">
                {i + 1}
              </span>
              <s.icon size={26} strokeWidth={2} aria-hidden="true" color="#12385a" />
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <div className="c03-step-hand">{s.hand}</div>
            </li>
          ))}
        </ol>

        <div className="c03-road" data-road aria-hidden="true">
          <div className="c03-road-caption">7:30 am — Dana R., Quincy. Booked last night at 9:15.</div>
          <div className="c03-road-sun" />
          <Houses className="c03-houses" />
          <div className="c03-road-asphalt" />
          <div className="c03-road-line" />
          <div className="c03-van" data-van>
            <Van />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ numbers --- */

function YourNumbers() {
  return (
    <section id="numbers" className="c03-paper c03-paper-2 c03-section" aria-labelledby="c03-numbers-title">
      <div className="c03-wrap">
        <div className="c03-head">
          <p className="c03-eyebrow">run your own numbers</p>
          <h2 id="c03-numbers-title" className="c03-h2" data-split>
            One recovered job is the whole conversation.
          </h2>
          <p className="c03-lede">
            Don&apos;t take our figures — use yours. Slide in what a job is actually worth at your
            shop and how much rings out, and the math answers itself. Be stingy with it.
          </p>
        </div>
        <Calculator />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- isn't --- */

const NOTS = [
  { t: "Not an answering service", d: "Nobody is sitting in a room pretending to be your front desk. It works alongside the one you have." },
  { t: "Not a new CRM", d: "Whatever you run jobs with today, you keep. Recovered jobs land there like any other." },
  { t: "Not something your techs install", d: "Nothing on the truck, nothing to log into, no training day." },
  { t: "Not a marketing retainer", d: "We're not buying ads or writing blog posts. This is recovery, not acquisition." },
  { t: "Not a long contract", d: "Month to month. Stop whenever it stops paying for itself." },
  { t: "Not sold as “AI”", d: "You're buying recovered jobs. How it's built is our problem, not your pitch." },
];

function WhatThisIsnt() {
  return (
    <section id="isnt" className="c03-board c03-section" aria-labelledby="c03-isnt-title">
      <div className="c03-wrap">
        <div className="c03-head">
          <p className="c03-eyebrow">straight answers</p>
          <h2 id="c03-isnt-title" className="c03-h2" data-split>
            What this isn&apos;t
          </h2>
          <p className="c03-lede">
            You&apos;ve been pitched before. Here&apos;s what we&apos;re not asking you to sign up
            for.
          </p>
        </div>
        <div className="c03-nots" data-reveal-group>
          {NOTS.map((n) => (
            <div className="c03-not" key={n.t}>
              <MarkerX className="c03-not-x" />
              <h3>{n.t}</h3>
              <p>{n.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- pricing --- */

function Pricing() {
  return (
    <section id="pricing" className="c03-paper c03-section" aria-labelledby="c03-pricing-title">
      <div className="c03-wrap">
        <div className="c03-pricing-grid">
          <div>
            <p className="c03-eyebrow">pricing</p>
            <h2 id="c03-pricing-title" className="c03-h2" data-split>
              Two numbers. No surprises.
            </h2>
            <p className="c03-lede">
              Setup is paid in full before we start work. The monthly doesn&apos;t begin until your
              system is actually live — not the day you sign.
            </p>

            <ol className="c03-timeline" data-reveal-group>
              <li className="c03-tl">
                <span className="c03-tl-dot" aria-hidden="true">
                  1
                </span>
                <h3>Verbal yes on the call</h3>
                <p>We send the setup pay link by hand. Nothing self-serve, nothing to click through.</p>
                <span className="c03-tl-tag is-due">$2,500 setup — paid in full</span>
              </li>
              <li className="c03-tl">
                <span className="c03-tl-dot is-zero" aria-hidden="true">
                  2
                </span>
                <h3>We build and test it with you</h3>
                <p>Days, not months. You hear it working with your own calls before it goes live.</p>
                <span className="c03-tl-tag is-zero">$0 monthly during setup</span>
              </li>
              <li className="c03-tl">
                <span className="c03-tl-dot is-money" aria-hidden="true">
                  3
                </span>
                <h3>Go-live day</h3>
                <p>The monthly starts today and not a day sooner. Month to month from here.</p>
                <span className="c03-tl-tag is-money">$750 / month from go-live</span>
              </li>
            </ol>
          </div>

          <div className="c03-price-card-wrap">
            <div className="c03-price-card" data-peel>
              <div className="c03-price-head">
                <span>Work order — recovery setup</span>
                <span>No. 0001</span>
              </div>
              <div className="c03-price-stamp" aria-hidden="true">
                <span className="c03-stamp c03-stamp-booked" data-x>
                  No contract
                  <small>cancel any time</small>
                </span>
              </div>
              <div className="c03-price-cols">
                <div className="c03-price-col">
                  <div className="c03-price-k">One-time setup</div>
                  <div className="c03-price-v">$2,500</div>
                  <p className="c03-price-d">
                    Paid in full before any work starts. Covers the build, the configuration around
                    your shop, and testing it with you until it&apos;s right.
                  </p>
                  <div className="c03-price-hand">before we start — no net-30</div>
                </div>
                <div className="c03-price-col">
                  <div className="c03-price-k">Then, monthly</div>
                  <div className="c03-price-v is-monthly">
                    $750<small>/mo</small>
                  </div>
                  <p className="c03-price-d">
                    Starts the day your system goes live — never at signing. Running, watching, and
                    the weekly recap. Month to month, cancel any time.
                  </p>
                  <div className="c03-price-hand">no revenue share, no per-call fee</div>
                </div>
              </div>
              <div className="c03-price-foot">
                <p>
                  We don&apos;t start until the setup fee clears, and you don&apos;t pay a monthly
                  until it&apos;s running. That&apos;s the whole deal.
                </p>
                <Link href="/demo" className="c03-btn c03-btn-cta">
                  Watch the demo first
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ questions --- */

function Questions() {
  return (
    <section id="faq" className="c03-paper c03-paper-2 c03-section" aria-labelledby="c03-faq-title">
      <div className="c03-wrap">
        <div className="c03-head">
          <p className="c03-eyebrow">questions</p>
          <h2 id="c03-faq-title" className="c03-h2" data-split>
            The ones we actually get
          </h2>
        </div>
        <Faq />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- fit --- */

function WhoItsFor() {
  return (
    <section id="fit" className="c03-board c03-section" aria-labelledby="c03-fit-title">
      <div className="c03-wrap">
        <div className="c03-head">
          <p className="c03-eyebrow">fit</p>
          <h2 id="c03-fit-title" className="c03-h2" data-split>
            Who this is built for
          </h2>
          <p className="c03-lede">
            We&apos;d rather tell you on the call that your shop isn&apos;t a fit than take the
            setup fee and disappoint you.
          </p>
        </div>
        <div className="c03-fit" data-reveal-group>
          <div className="c03-fit-card is-yes">
            <div className="c03-fit-k">
              <h3>A fit</h3>
              <span className="c03-stamp c03-stamp-booked c03-stamp-inline" aria-hidden="true">
                Yes
              </span>
            </div>
            <ul className="c03-fit-list">
              {[
                "HVAC shops running roughly 5 to 30 trucks",
                "Greater Boston and eastern Massachusetts",
                "Your phone rings after hours and nobody's on it",
                "You send written estimates and some go quiet",
                "You already have an answering service and still lose calls",
              ].map((t) => (
                <li key={t}>
                  <Tick />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="c03-fit-card is-no">
            <div className="c03-fit-k">
              <h3>Not a fit</h3>
              <span className="c03-stamp c03-stamp-missed c03-stamp-inline" aria-hidden="true">
                No
              </span>
            </div>
            <ul className="c03-fit-list">
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
    </section>
  );
}

/* ------------------------------------------------------------ final cta --- */

function FinalCta() {
  return (
    <section className="c03-board c03-board-deep c03-final" aria-labelledby="c03-final-title">
      <div className="c03-wrap">
        <div data-reveal>
          <WallClock className="c03-final-clock" />
        </div>
        <h2 id="c03-final-title" data-split>
          Watch it once. <em>Then decide.</em>
        </h2>
        <p data-reveal>
          Five minutes to see exactly what gets recovered, then a fifteen-minute call to find out
          whether your shop is a fit. Nothing to sign either way.
        </p>
        <div className="c03-cta-row" data-reveal>
          <Link href="/demo" className="c03-btn c03-btn-cta">
            Watch the 5-min demo
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </Link>
          <span className="c03-cta-then">then a 15-minute call</span>
        </div>
        <p className="c03-final-fine" data-reveal>
          No self-serve signup — reply to the email that sent you here.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- footer --- */

function Footer() {
  return (
    <footer className="c03-footer">
      <div className="c03-wrap c03-footer-inner">
        <div>
          <div className="c03-footer-brand">{BUSINESS_NAME}</div>
          <p className="c03-footer-tag">
            Missed-call and dead-estimate recovery for HVAC shops in Greater Boston and eastern
            Massachusetts.
          </p>
        </div>
        <nav className="c03-footer-links" aria-label="Footer">
          <Link href="/demo">Demo</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/login">Admin</Link>
        </nav>
      </div>
    </footer>
  );
}
