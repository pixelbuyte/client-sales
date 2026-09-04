"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, MQ, setNavTheme } from "./gsapSetup";
import { Check, PhoneArt, QuoteArt } from "./Illustrations";

// Three full-viewport panels that stack. On desktop the section pins and
// each next panel wipes up over the last (transform-only, snapped). On
// mobile and under reduced motion they simply stack in normal flow.

const PANELS = [
  {
    key: "01",
    tone: "navy",
    eyebrow: "Leak one",
    title: "The call nobody answered.",
    lede:
      "Nights, weekends, storm days, and every hour your office manager is on the other line. The customer doesn't leave a voicemail. They hang up and call the next shop.",
    points: [
      "The missed call gets a text back within seconds, not the next morning",
      "No-heat, no-AC-in-a-heat-wave, water on the floor: flagged, not queued",
      "The customer picks a callback window instead of picking your competitor",
    ],
  },
  {
    key: "02",
    tone: "paper",
    eyebrow: "Leak two",
    title: "The estimate that went quiet.",
    lede:
      "You quoted a system replacement three weeks ago. They didn't say no. They just never replied, and nobody in the shop had an afternoon to chase it.",
    points: [
      "A check-in a few days after the quote goes out",
      "A second touch before it goes cold for good",
      "You hear a yes, a no, or an objection you can actually answer",
    ],
  },
  {
    key: "03",
    tone: "deep",
    eyebrow: "Where it lands",
    title: "Back with your team, like any other job.",
    lede:
      "Recovered calls and estimate replies show up the way a booked job does today. No new inbox to check. A weekly recap shows what came back.",
    points: [
      "Works alongside the answering service you already pay for",
      "You keep your number and whatever you run jobs with",
      "Weekly recap: what came back, when, and what it was",
    ],
  },
] as const;

export function Leaks() {
  const rootRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stack = stackRef.current;
    if (!root || !stack) return;

    const mm = gsap.matchMedia();
    mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions as Record<string, boolean>;
      if (!motion || !desktop) return;

      const wipes = Array.from(stack.querySelectorAll<HTMLElement>(".c04-panel-wipe"));
      const inners = Array.from(stack.querySelectorAll<HTMLElement>(".c04-panel-inner"));
      const dots = Array.from(root.querySelectorAll<HTMLElement>(".c04-panel-progress i"));

      gsap.set(stack, { height: "100vh" });
      gsap.set(wipes, { position: "absolute", inset: 0 });
      gsap.set(wipes, { yPercent: 100 });
      gsap.set(inners, { yPercent: -100 });

      const n = wipes.length; // panels after the first
      const hold = 0.3; // dead zone at the end so scrub lag settles before unpin
      const total = n + hold;
      const stops = [0, ...wipes.map((_, i) => (i + 1) / total), 1];
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${Math.round(total * 100)}%`,
          pin: true,
          scrub: 0.3,
          anticipatePin: 1,
          snap: {
            snapTo: stops,
            duration: { min: 0.25, max: 0.6 },
            delay: 0.08,
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            const idx = Math.min(n, Math.round(self.progress * total));
            dots.forEach((d, i) => d.classList.toggle("is-on", i === idx));
            setNavTheme(PANELS[idx].tone === "paper" ? "light" : "dark");
          },
        },
      });
      wipes.forEach((w, i) => {
        tl.to(w, { yPercent: 0, ease: "none", duration: 1 }, i);
        tl.to(inners[i], { yPercent: 0, ease: "none", duration: 1 }, i);
      });
      tl.to({}, { duration: hold });
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);

    return () => mm.revert();
  }, []);

  return (
    <section className="c04-leaks" id="leaks" ref={rootRef} data-nav="dark" aria-labelledby="c04-leaks-title">
      <h2 id="c04-leaks-title" className="c04-sr">
        Two leaks, and where the recovered work lands
      </h2>
      <div className="c04-stack" ref={stackRef}>
        {PANELS.map((p, i) => {
          const panel = (
            <article className={`c04-panel c04-panel--${p.tone} c04-grained`} key={p.key}>
              <div className="c04-wrap c04-panel-grid">
                <div>
                  <div className="c04-panel-index">
                    <span className="c04-num">{p.key}</span>
                    <span className="c04-eyebrow">{p.eyebrow}</span>
                  </div>
                  <h3 className="c04-display" style={{ fontSize: "clamp(2.4rem, 4.8vw, 4.6rem)", letterSpacing: "-0.035em", maxWidth: "13ch" }}>
                    {p.title}
                  </h3>
                  <p className="c04-lede">{p.lede}</p>
                  <ul className="c04-points">
                    {p.points.map((pt) => (
                      <li key={pt}>
                        <Check />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="c04-panel-art">
                  {i === 0 ? <PhoneArt /> : i === 1 ? <QuoteArt /> : <Recap />}
                </div>
              </div>
            </article>
          );
          if (i === 0) return panel;
          return (
            <div className="c04-panel-wipe" key={p.key}>
              <div className="c04-panel-inner">{panel}</div>
            </div>
          );
        })}
      </div>
      <div className="c04-panel-progress" aria-hidden="true">
        <i className="is-on" />
        <i />
        <i />
      </div>
    </section>
  );
}

// An example of the weekly recap, labeled as such. Nothing here is a claim.
function Recap() {
  return (
    <div className="c04-recap">
      <div className="c04-recap-head">
        Weekly recap <span>example week · not a result</span>
      </div>
      <div className="c04-recap-row">
        <div>
          <b>Dana R. · Quincy</b>
          <small>Tue 9:14 pm · no heat · booked 7:30 am</small>
        </div>
        <span className="c04-tag">Booked</span>
      </div>
      <div className="c04-recap-row">
        <div>
          <b>Marcus T. · Weymouth</b>
          <small>Tue 11:41 pm · no heat, newborn · flagged urgent</small>
        </div>
        <span className="c04-tag">Escalated</span>
      </div>
      <div className="c04-recap-row">
        <div>
          <b>Joanne P. · Milton</b>
          <small>Replacement quote · replied day 3 · &ldquo;waiting on financing&rdquo;</small>
        </div>
        <span className="c04-tag">Replied</span>
      </div>
      <div className="c04-recap-row">
        <div>
          <b>Ed K. · Braintree</b>
          <small>Thu 6:52 pm · rang out · no reply to the text</small>
        </div>
        <span className="c04-tag c04-tag--quiet">Quiet</span>
      </div>
    </div>
  );
}
