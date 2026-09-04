"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, motionAllowed } from "./motion";

type Ticket = {
  no: string;
  at: string;
  name: string;
  town: string;
  said: string;
  outcome: string;
  detail: string;
};

// Three calls after close, one Tuesday. An illustration of a night — first
// name, last initial, town, what they actually said.
const TICKETS: Ticket[] = [
  {
    no: "2211",
    at: "9:14 pm",
    name: "Dana R.",
    town: "Quincy",
    said: "Furnace won't fire, house is down to 54.",
    outcome: "Booked",
    detail: "7:30 am",
  },
  {
    no: "2212",
    at: "11:41 pm",
    name: "Marcus T.",
    town: "Weymouth",
    said: "No heat and we have a newborn here.",
    outcome: "Flagged",
    detail: "on-call tech, 11:43 pm",
  },
  {
    no: "2213",
    at: "6:30 am",
    name: "Joanne P.",
    town: "Milton",
    said: "Had a question on the replacement quote.",
    outcome: "Replied",
    detail: "quote signed",
  },
];

export function Scenarios() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !motionAllowed()) return;
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>(".c1-sticket").forEach((card, i) => {
        const missed = card.querySelector(".c1-stamp--missed");
        const booked = card.querySelector(".c1-stamp--booked");
        const edge = card.querySelector(".c1-sticket-edge");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
          delay: i * 0.08,
        });
        tl.from(card, { y: 30, autoAlpha: 0, duration: 0.55, ease: "power3.out" })
          .fromTo(missed, { autoAlpha: 1, scale: 1 }, { autoAlpha: 1, duration: 0.3 })
          .to(missed, { autoAlpha: 0, scale: 0.9, duration: 0.25, ease: "power2.in" })
          .fromTo(
            edge,
            { backgroundColor: "#C0392B" },
            { backgroundColor: "#1F8A5B", duration: 0.4 },
            "<",
          )
          .fromTo(
            booked,
            { autoAlpha: 0, scale: 2.4, rotate: -22 },
            { autoAlpha: 1, scale: 1, rotate: -8, duration: 0.8, ease: "elastic.out(1, 0.55)" },
            "<0.05",
          );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="c1-night-list">
      {TICKETS.map((t) => (
        <article key={t.no} className="c1-sticket">
          <span className="c1-sticket-edge" aria-hidden="true" />
          <div className="c1-sticket-meta">
            <span className="c1-mono">#{t.no}</span>
            <span className="c1-mono">{t.at}</span>
          </div>
          <div className="c1-sticket-who">
            {t.name} <span>· {t.town}</span>
          </div>
          <p className="c1-sticket-said">&ldquo;{t.said}&rdquo;</p>
          <div className="c1-sticket-stamps">
            <div className="c1-stamp c1-stamp--missed" aria-hidden="true">
              <b>Missed</b>
              <span>no answer</span>
            </div>
            <div className="c1-stamp c1-stamp--booked">
              <b>{t.outcome}</b>
              <span>{t.detail}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
