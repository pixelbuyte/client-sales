"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, MOTION_OK, DESKTOP } from "./gsapSetup";

type Day = {
  day: string;
  time: string;
  quiet?: boolean;
  name: string;
  town: string;
  said: string;
  what: string;
  stamp: string;
  when: string;
};

// One week of after-hours calls, told as job tickets. An illustration of a
// week, not a report — the closing card says so.
const WEEK: Day[] = [
  {
    day: "Mon",
    time: "9:14 pm",
    name: "Dana R.",
    town: "Quincy",
    said: "Furnace won't fire, house is down to 54.",
    what: "Text back within seconds. She picked the 7–9 am window.",
    stamp: "Booked",
    when: "Tue 7:30 am",
  },
  {
    day: "Tue",
    time: "11:41 pm",
    name: "Marcus T.",
    town: "Weymouth",
    said: "No heat and we have a newborn here.",
    what: "Flagged urgent, not queued. Your on-call tech got it tonight.",
    stamp: "Booked",
    when: "Tonight",
  },
  {
    day: "Wed",
    time: "6:30 am",
    quiet: true,
    name: "Joanne P.",
    town: "Milton",
    said: "Had a question on the replacement quote.",
    what: "Estimate check-in went out Tuesday. She replied before the office opened.",
    stamp: "Booked",
    when: "Install Fri",
  },
  {
    day: "Thu",
    time: "5:52 pm",
    name: "Luis F.",
    town: "Brockton",
    said: "Blower's making a grinding noise. Can someone come out?",
    what: "Office had just closed. He picked Friday, first thing.",
    stamp: "Booked",
    when: "Fri 8:00 am",
  },
  {
    day: "Fri",
    time: "7:05 pm",
    name: "Pat M.",
    town: "Dedham",
    said: "Got your quote three weeks ago. Is that price still good?",
    what: "The second touch on a quiet estimate. Yes, it was.",
    stamp: "Booked",
    when: "Install Wed",
  },
  {
    day: "Sat",
    time: "10:20 am",
    name: "Karen W.",
    town: "Hingham",
    said: "Heat pump iced over again.",
    what: "Saturday, nobody at the desk. She took Monday morning.",
    stamp: "Booked",
    when: "Mon 9:00 am",
  },
  {
    day: "Sun",
    time: "8:48 pm",
    name: "Tom B.",
    town: "Marshfield",
    said: "No hot water. The boiler light is out.",
    what: "Sunday night. Text back, callback window, on the board.",
    stamp: "Booked",
    when: "Mon 7:00 am",
  },
];

export function Filmstrip() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const track = root.querySelector<HTMLElement>(".c02-film-track");
      const stage = root.querySelector<HTMLElement>(".c02-film-stage");
      const cards = Array.from(root.querySelectorAll<HTMLElement>(".c02-day"));
      if (!track || !stage) return;

      const mm = gsap.matchMedia();

      // Desktop: pin the section and scrub the track sideways. A card is
      // stamped Booked the moment it crosses the middle of the screen.
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const stampByPosition = () => {
          const limit = window.innerWidth * 0.6;
          cards.forEach((c) => {
            const r = c.getBoundingClientRect();
            c.classList.toggle("is-stamped", r.left + r.width * 0.5 < limit);
          });
        };
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          onUpdate: stampByPosition,
          scrollTrigger: {
            trigger: root,
            start: "top 72px",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: stampByPosition,
          },
        });

        gsap.from(cards, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: stage, start: "top 85%", once: true },
        });
      });

      // Mobile / reduced motion: cards stack; each one is stamped as it
      // scrolls into view. Nothing pins.
      mm.add(`(max-width: 767px) and ${MOTION_OK}`, () => {
        cards.forEach((c) => {
          ScrollTrigger.create({
            trigger: c,
            start: "top 72%",
            onEnter: () => c.classList.add("is-stamped"),
            onLeaveBack: () => c.classList.remove("is-stamped"),
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        cards.forEach((c) => c.classList.add("is-stamped"));
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="c02-film" id="week" aria-labelledby="c02-week-title">
      <div className="c02-wrap">
        <div className="c02-sechead">
          <div className="c02-num" aria-hidden="true">
            03
          </div>
          <div className="c02-sechead-body">
            <p className="c02-eyebrow">
              <span className="c02-rule" aria-hidden="true" />
              <span>One week, after hours</span>
            </p>
            <h2 id="c02-week-title" className="c02-h2" data-split>
              Seven calls that would have gone to the <em>next shop.</em>
            </h2>
            <p className="c02-film-hint">Keep scrolling — the week moves sideways.</p>
          </div>
        </div>
      </div>

      <div className="c02-film-stage">
        <div className="c02-film-track">
          {WEEK.map((d) => (
            <article key={d.day} className="c02-day">
              <div className="c02-day-head">
                <div className="c02-day-name">{d.day}</div>
                <div className={`c02-day-time${d.quiet ? " is-quiet" : ""}`}>{d.time}</div>
              </div>
              <div className="c02-ticket-name">
                {d.name} <span>· {d.town}</span>
              </div>
              <p className="c02-ticket-said">&ldquo;{d.said}&rdquo;</p>
              <p className="c02-day-what">{d.what}</p>
              <div className="c02-stamp" aria-label={`${d.stamp}, ${d.when}`}>
                {d.stamp}
                <small>{d.when}</small>
              </div>
            </article>
          ))}

          <article className="c02-day c02-day-end">
            <div className="c02-day-name">Sun · late</div>
            <div>
              <p>Seven jobs back on the board. None of them rang at your desk.</p>
              <small>
                This is a week we drew, not a week we&apos;re claiming. Your numbers come from your
                phone — that&apos;s what the demo is for.
              </small>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
