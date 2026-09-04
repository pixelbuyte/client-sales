"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, MOTION_OK, DESKTOP, FINE_POINTER } from "./gsapSetup";
import { attachMagnet, flyInVars, stampIn } from "./motion";
import { Ticket, type TicketData } from "./Ticket";

type Day = { day: string; t: TicketData };

// A worked example of one week. The dollar figures are illustrative ticket
// values, not results — the tally says so, and the calculator below it asks
// for the shop's own numbers.
const WEEK: Day[] = [
  {
    day: "Monday, 9:14 pm",
    t: {
      no: "2211",
      at: "9:14 pm",
      name: "Dana R.",
      town: "Quincy",
      said: "Furnace won't fire, house is down to 54.",
      booked: "Booked 7:30 am, Truck 2. She picked the window herself.",
      value: 385,
      kind: "call",
    },
  },
  {
    day: "Tuesday, 11:41 pm",
    t: {
      no: "2212",
      at: "11:41 pm",
      name: "Marcus T.",
      town: "Weymouth",
      said: "No heat and we have a newborn here.",
      booked: "Flagged urgent. On-call tech had it one minute later.",
      stamp: "On call",
      value: 520,
      kind: "call",
    },
  },
  {
    day: "Wednesday, 6:30 am",
    t: {
      no: "2213",
      at: "6:30 am",
      name: "Joanne P.",
      town: "Milton",
      said: "Had a question on the replacement quote.",
      booked: "Replied before the office opened. Financing question, answered.",
      stamp: "Replied",
      value: 9800,
      kind: "estimate",
    },
  },
  {
    day: "Thursday, 12:20 pm",
    t: {
      no: "2214",
      at: "12:20 pm",
      name: "Rick D.",
      town: "Braintree",
      said: "Called twice, got voicemail. AC's dead upstairs.",
      booked: "Overflow while the desk was on another line. Booked Friday 9 am.",
      value: 310,
      kind: "call",
    },
  },
  {
    day: "Friday, 8:05 pm",
    t: {
      no: "2215",
      at: "day 22",
      name: "Priya S.",
      town: "Dedham",
      said: "That quote from last month — are we still on?",
      booked: "Second touch before it went cold. Her answer: yes, book it.",
      stamp: "Replied",
      value: 11400,
      kind: "estimate",
    },
  },
  {
    day: "Saturday, 7:50 am",
    t: {
      no: "2216",
      at: "7:50 am",
      name: "Tom B.",
      town: "Hingham",
      said: "Boiler's banging and there's no hot water.",
      booked: "Booked Saturday 11 am. He never called anyone else.",
      value: 445,
      kind: "call",
    },
  },
];

const TOTAL = WEEK.reduce((s, d) => s + (d.t.value ?? 0), 0);
const CALLS = WEEK.filter((d) => d.t.kind === "call").length;
const ESTIMATES = WEEK.filter((d) => d.t.kind === "estimate").length;

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function WeekBoard() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-week-item]"));
      const num = el.querySelector<HTMLElement>("[data-tally-num]");
      const callsEl = el.querySelector<HTMLElement>("[data-tally-calls]");
      const estEl = el.querySelector<HTMLElement>("[data-tally-est]");

      // Start the tally at zero; each ticket that gets stamped adds its value.
      const tally = { value: 0, calls: 0, est: 0 };
      const render = () => {
        if (num) num.textContent = fmt(tally.value);
        if (callsEl) callsEl.textContent = String(Math.round(tally.calls));
        if (estEl) estEl.textContent = String(Math.round(tally.est));
      };
      render();

      let running = 0;
      let runningCalls = 0;
      let runningEst = 0;

      items.forEach((item, i) => {
        const ticket = item.querySelector<HTMLElement>("[data-ticket]");
        const stamp = item.querySelector<HTMLElement>('[data-stamp="booked"]');
        const value = Number(item.dataset.value || 0);
        const isEstimate = item.dataset.kind === "estimate";
        running += value;
        if (isEstimate) runningEst += 1;
        else runningCalls += 1;
        const target = { value: running, calls: runningCalls, est: runningEst };
        if (!ticket || !stamp) return;

        gsap.set(stamp, { opacity: 0, scale: 1.6 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
        });
        tl.from(item.querySelector("[data-week-day]"), { x: -16, opacity: 0, duration: 0.3, ease: "power2.out" }, 0);
        tl.from(ticket, flyInVars(i, { duration: 0.9, ease: "elastic.out(1, 0.75)" }), 0.05);
        tl.add(stampIn(stamp, ticket), 0.5);
        tl.to(
          tally,
          {
            value: target.value,
            calls: target.calls,
            est: target.est,
            duration: 0.6,
            ease: "power2.out",
            onUpdate: render,
          },
          0.62,
        );
        tl.fromTo(num, { scale: 1.06, transformOrigin: "0% 50%" }, { scale: 1, duration: 0.5, ease: "power2.out" }, "<");
      });

      ScrollTrigger.refresh();
    });

    mm.add(`${MOTION_OK} and ${DESKTOP} and ${FINE_POINTER}`, () => {
      const zone = el.querySelector<HTMLElement>("[data-magnet-zone]");
      if (!zone) return;
      const off = attachMagnet(zone, "[data-week-item]", 5);
      return () => off();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="week" className="c03-board c03-section" aria-labelledby="c03-week-title">
      <div className="c03-wrap">
        <div className="c03-head">
          <p className="c03-eyebrow">one week, worked example</p>
          <h2 id="c03-week-title" className="c03-h2" data-split>
            What came back this week
          </h2>
          <p className="c03-lede">
            Six tickets that would have gone quiet. Scroll down and watch them get stamped. The
            dollar figures are what those jobs are typically worth if they go ahead — it&apos;s an
            example, not a promise. Put your own numbers in below.
          </p>
        </div>

        <div className="c03-week-grid">
          <div className="c03-week-list" data-magnet-zone>
            {WEEK.map((d, i) => (
              <div
                key={d.t.no}
                className="c03-week-ticket"
                data-week-item
                data-value={d.t.value}
                data-kind={d.t.kind}
              >
                <p className="c03-week-day" data-week-day>
                  {d.day}
                </p>
                <Ticket t={d.t} state="booked" tape={i % 2 ? "top" : "corners"} showValue />
              </div>
            ))}
          </div>

          <aside className="c03-tally" aria-live="polite">
            <div className="c03-tally-title">Weekly recap</div>
            <div className="c03-tally-note">what came back — worked example</div>
            <div className="c03-tally-num">
              <span data-tally-num>{fmt(TOTAL)}</span>
              <small>if it all goes ahead</small>
            </div>
            <ul className="c03-tally-rows">
              <li>
                <span>Calls that came back</span>
                <b data-tally-calls>{CALLS}</b>
              </li>
              <li>
                <span>Estimates that answered</span>
                <b data-tally-est>{ESTIMATES}</b>
              </li>
              <li>
                <span>Monthly, once live</span>
                <b>$750</b>
              </li>
            </ul>
            <p className="c03-tally-foot">
              This is the shape of the recap you get every week: who called, when, what they said,
              and what happened next. Example values. Your recap shows your jobs.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
