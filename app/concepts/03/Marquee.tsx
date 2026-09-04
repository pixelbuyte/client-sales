"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION_OK } from "./gsapSetup";

const TOWNS = [
  "Quincy",
  "Weymouth",
  "Braintree",
  "Milton",
  "Dedham",
  "Norwood",
  "Brockton",
  "Plymouth",
  "Waltham",
  "Newton",
  "Medford",
  "Somerville",
  "Cambridge",
  "Lynn",
  "Salem",
  "Peabody",
  "Framingham",
  "Marshfield",
  "Hingham",
  "Randolph",
];

/** A strip of masking tape with the service area written down it. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const track = el.querySelector<HTMLElement>("[data-track]");
      const run = el.querySelector<HTMLElement>("[data-run]");
      if (!track || !run) return;
      // Two identical runs; slide by exactly one run width and wrap.
      const tween = gsap.to(track, {
        x: () => -run.offsetWidth,
        duration: () => run.offsetWidth / 60,
        ease: "none",
        repeat: -1,
      });
      // Slow down while the pointer is over it, so towns can be read.
      const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.5 });
      const fast = () => gsap.to(tween, { timeScale: 1, duration: 0.5 });
      el.addEventListener("pointerenter", slow);
      el.addEventListener("pointerleave", fast);
      return () => {
        el.removeEventListener("pointerenter", slow);
        el.removeEventListener("pointerleave", fast);
        tween.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="c03-tape-strip" aria-label="Service area">
      <div className="c03-tape-track" data-track>
        <div className="c03-tape-run" data-run>
          {TOWNS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="c03-tape-run" aria-hidden="true">
          {TOWNS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
