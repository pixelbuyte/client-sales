"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, CINEMATIC, MOTION_OK } from "./motion";

// 24 one-hour slots starting at 6 am. Office hours are 7 am to 5 pm.
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = (6 + i) % 24;
  const open = h >= 7 && h < 17;
  const label = h === 0 ? "12a" : h === 12 ? "12p" : h < 12 ? `${h}a` : `${h - 12}p`;
  return { h, open, label };
});

// 9:14 pm sits in slot index (21 - 6) = 15, about a quarter of the way in.
const MARKER_PCT = ((15 + 14 / 60) / 24) * 100;

export function HourBar() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const bars = root.querySelectorAll<HTMLElement>(".c1-hour");
      const marker = root.querySelector<HTMLElement>(".c1-marker");
      const mm = gsap.matchMedia();

      // Desktop: the day fills in hour by hour, tied to the scroll.
      mm.add(CINEMATIC, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 78%", end: "bottom 45%", scrub: 0.6 },
        });
        tl.from(bars, { scaleY: 0, transformOrigin: "50% 100%", stagger: 0.05, ease: "none" });
        if (marker) tl.from(marker, { autoAlpha: 0, y: 10, duration: 0.3 }, ">-0.35");
      });

      // Small screens with motion: same fill, one pass, on entry.
      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        });
        tl.from(bars, {
          scaleY: 0,
          transformOrigin: "50% 100%",
          stagger: 0.04,
          duration: 0.5,
          ease: "power2.out",
        });
        if (marker) tl.from(marker, { autoAlpha: 0, y: 10, duration: 0.4 }, ">-0.2");
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="c1-hours-wrap">
      <div className="c1-hours" role="img" aria-label="A 24-hour day. The office is open from 7 am to 5 pm; the other 14 hours and all weekend, the phone rings out.">
        {HOURS.map((slot) => (
          <div key={slot.h} className={`c1-hour ${slot.open ? "c1-hour--open" : ""}`} />
        ))}
        <div className="c1-marker" style={{ left: `${MARKER_PCT}%` }} aria-hidden="true">
          <span className="c1-marker-line" />
          <span className="c1-marker-tag">9:14 pm</span>
        </div>
      </div>
      <div className="c1-hour-labels" aria-hidden="true">
        {HOURS.map((slot, i) => (
          <span key={slot.h} className={i % 3 === 0 ? "" : "is-quiet"}>
            {slot.label}
          </span>
        ))}
      </div>
      <div className="c1-hour-legend" aria-hidden="true">
        <span>
          <i className="c1-swatch c1-swatch--open" /> Someone at the desk
        </span>
        <span>
          <i className="c1-swatch c1-swatch--dark" /> Rings out
        </span>
      </div>
    </div>
  );
}
