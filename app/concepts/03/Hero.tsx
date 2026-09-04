"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, SplitText, MOTION_OK, DESKTOP, FINE_POINTER } from "./gsapSetup";
import { attachMagnet, flyInVars, stampIn, stampOut } from "./motion";
import { Ticket, type TicketData } from "./Ticket";
import { WallClock, Tick } from "./Illustrations";

const TICKETS: TicketData[] = [
  {
    no: "2211",
    at: "9:14 pm",
    name: "Dana R.",
    town: "Quincy",
    said: "Furnace won't fire, house is down to 54.",
    booked: "Booked 7:30 am — Truck 2. She picked the window herself.",
  },
  {
    no: "2212",
    at: "11:41 pm",
    name: "Marcus T.",
    town: "Weymouth",
    said: "No heat and we have a newborn here.",
    booked: "Flagged urgent. Your on-call tech had it at 11:42 pm.",
    stamp: "On call",
  },
  {
    no: "2213",
    at: "6:30 am",
    name: "Joanne P.",
    town: "Milton",
    said: "Had a question on the replacement quote.",
    booked: "Replied before the office opened. Financing question, answered.",
    stamp: "Replied",
    kind: "estimate",
  },
];

const FACTS = [
  "Nothing for your techs to install",
  "You keep your number",
  "Monthly starts at go-live",
  "Cancel any time",
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const onRef = useRef(false);
  const touched = useRef(false);
  const motionOk = useRef(false);
  const introDone = useRef(false);
  const autoFlip = useRef<gsap.core.Tween | null>(null);

  const flip = useCallback((next: boolean, byUser: boolean) => {
    if (byUser) {
      touched.current = true;
      autoFlip.current?.kill();
    }
    onRef.current = next;
    setOn(next);
  }, []);

  /* Intro: headline words pop, the clock sweeps to 9:14, the tickets fly onto
     the board and get stamped MISSED. Then the switch flips itself once. */
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      motionOk.current = true;
      const h1 = el.querySelector("h1");
      const tickets = el.querySelectorAll<HTMLElement>("[data-ticket]");
      const missedStamps = el.querySelectorAll<HTMLElement>('[data-stamp="missed"]');
      const bookedStamps = el.querySelectorAll<HTMLElement>('[data-stamp="booked"]');
      const hour = el.querySelector<SVGGElement>('[data-hand="hour"]');
      const minute = el.querySelector<SVGGElement>('[data-hand="minute"]');
      const second = el.querySelector<SVGGElement>('[data-hand="second"]');

      gsap.set(bookedStamps, { opacity: 0, scale: 1.6 });
      gsap.set(missedStamps, { opacity: 0, scale: 1.6 });

      // Word splits don't depend on font metrics, so this can run synchronously
      // inside the matchMedia context (which keeps React strict-mode double
      // effects from leaving tweens behind).
      const split = h1 ? new SplitText(h1, { type: "words", wordsClass: "c03-word" }) : null;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      {
        tl.from("[data-hero-kicker]", { y: 18, opacity: 0, duration: 0.5 });
        if (split) {
          tl.from(
            split.words,
            {
              yPercent: 70,
              opacity: 0,
              rotation: 4,
              scale: 0.92,
              transformOrigin: "0% 100%",
              duration: 0.7,
              stagger: 0.045,
              ease: "back.out(1.8)",
            },
            "-=0.25",
          );
        }
        tl.from(
          "[data-hero-sub], [data-hero-cta], [data-hero-facts]",
          { y: 22, opacity: 0, duration: 0.6, stagger: 0.1 },
          "-=0.45",
        );
        tl.from("[data-panel]", { y: 70, opacity: 0, rotation: -1.5, duration: 0.9 }, 0.25);

        // Clock sweeps from 5:00 to 9:14.
        const hands = { h: 150, m: 0 };
        tl.to(
          hands,
          {
            h: 277,
            m: 84,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (hour) hour.style.transform = `rotate(${hands.h}deg)`;
              if (minute) minute.style.transform = `rotate(${hands.m}deg)`;
            },
          },
          0.55,
        );

        tl.from(tickets, flyInVars(0, { stagger: 0.13, rotation: (i: number) => (i % 2 ? 5 : -5) }), 0.75);
        missedStamps.forEach((s, i) => {
          tl.add(stampIn(s, tickets[i] ?? null), 1.35 + i * 0.16);
        });
        tl.call(
          () => {
            introDone.current = true;
          },
          [],
          "+=0.05",
        );

        autoFlip.current = gsap.delayedCall(tl.duration() + 2.5, () => {
          if (!touched.current && !onRef.current) flip(true, false);
        });
      }

      // Seconds hand keeps ticking — quietly.
      const sec = { s: 190 };
      const tick = second
        ? gsap.to(sec, {
            s: "+=360",
            duration: 60,
            ease: "steps(60)",
            repeat: -1,
            onUpdate: () => {
              second.style.transform = `rotate(${sec.s}deg)`;
            },
          })
        : null;

      return () => {
        tl.kill();
        tick?.kill();
        autoFlip.current?.kill();
        split?.revert();
      };
    });

    // Desktop pointer: tickets lean toward the cursor a few pixels.
    mm.add(`${MOTION_OK} and ${DESKTOP} and ${FINE_POINTER}`, () => {
      const zone = el.querySelector<HTMLElement>("[data-magnet-zone]");
      if (!zone) return;
      const off = attachMagnet(zone, "[data-magnet]", 6);
      return () => off();
    });

    return () => mm.revert();
  }, [flip]);

  /* Stamp swap whenever the switch changes. */
  useEffect(() => {
    const el = root.current;
    if (!el || !motionOk.current) return;
    const tickets = el.querySelectorAll<HTMLElement>("[data-ticket]");
    const from = el.querySelectorAll<HTMLElement>(on ? '[data-stamp="missed"]' : '[data-stamp="booked"]');
    const to = el.querySelectorAll<HTMLElement>(on ? '[data-stamp="booked"]' : '[data-stamp="missed"]');
    if (!introDone.current && !on) return; // initial render: the intro handles MISSED
    from.forEach((s) => stampOut(s));
    to.forEach((s, i) => stampIn(s, tickets[i] ?? null, 0.12 + i * 0.16));
    gsap.fromTo(
      el.querySelectorAll("[data-foot]"),
      { opacity: 0.2 },
      { opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.12 },
    );
  }, [on]);

  return (
    <section ref={root} className="c03-board c03-hero" aria-labelledby="c03-hero-title">
      <div className="c03-wrap c03-hero-grid">
        <div>
          <p className="c03-hero-kicker" data-hero-kicker>
            for HVAC shops · Greater Boston
          </p>
          <h1 id="c03-hero-title" className="c03-h1">
            The 9:14 pm call, <em>back on your board</em> by morning.
          </h1>
          <p className="c03-hero-sub" data-hero-sub>
            The no-heat call that rang out after close, and the replacement quote nobody had time to
            chase. The customer gets a text back in seconds, urgent jobs get flagged, and it all lands
            with your team like any other booked job.
          </p>
          <div className="c03-cta-row c03-hero-ctas" data-hero-cta>
            <Link href="/demo" className="c03-btn c03-btn-cta">
              Watch the 5-min demo
              <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </Link>
            <span className="c03-cta-then">then a 15-minute call</span>
          </div>
          <ul className="c03-hero-facts" data-hero-facts>
            {FACTS.map((f) => (
              <li key={f}>
                <Tick size={15} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="c03-panel" data-panel>
            <div className="c03-sticky" aria-hidden="true">
              text goes out seconds after a missed call
            </div>
            <div className="c03-panel-field" data-magnet-zone>
              <div className="c03-panel-top">
                <div className="c03-panel-title">
                  Tuesday night
                  <small>{on ? "— covered" : "— as it stands"}</small>
                </div>
                <WallClock className="c03-clock" />
              </div>

              <div className="c03-panel-tickets">
                {TICKETS.map((t) => (
                  <div key={t.no} data-magnet>
                    <Ticket t={t} state={on ? "booked" : "missed"} />
                  </div>
                ))}
              </div>

              <div className="c03-switch-plate">
                <div className="c03-switch-text">
                  <div className="c03-switch-label">Recovery</div>
                  <div className="c03-switch-sub">
                    {on ? "Same three calls. Every one back on the board." : "Three calls after close. Nobody at the desk."}
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={on ? "Recovery is on. Switch it off" : "Recovery is off. Switch it on"}
                  className="c03-switch"
                  onClick={() => flip(!on, true)}
                >
                  <span className="c03-switch-track" aria-hidden="true">
                    <span className="c03-switch-knob" />
                  </span>
                  <span className="c03-switch-state" aria-hidden="true">
                    {on ? "ON" : "OFF"}
                  </span>
                </button>
              </div>
            </div>
            <p className="c03-panel-foot">
              {on ? (
                <>
                  Three jobs that were headed to the next shop.{" "}
                  <button type="button" onClick={() => flip(false, true)}>
                    See it the other way
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => flip(true, true)}>
                    Flip the switch
                  </button>{" "}
                  and watch the same night end differently.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
