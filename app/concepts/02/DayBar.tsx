"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION_OK, EASE } from "./gsapSetup";

// 24 hours starting at 6 am. The office is staffed 8 am to 5 pm (nine
// hours); everything else is the dark band. 9 pm is where the hero's call
// lands, so it gets the brick mark.
const HOURS = [
  "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p",
  "6p", "7p", "8p", "9p", "10p", "11p", "12a", "1a", "2a", "3a", "4a", "5a",
];
const OPEN_FROM = 2; // 8a
const OPEN_TO = 11; // up to (not including) 5p
const CALL_INDEX = 15; // 9p

export function DayBar() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: EASE },
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        });
        tl.from(".c02-daybar-seg", { scaleY: 0, duration: 0.6, stagger: 0.025 })
          .from(".c02-daybar-labels span", { opacity: 0, duration: 0.5 }, 0.5)
          .from(".c02-daybar-pin", { opacity: 0, y: -8, duration: 0.6 }, 0.8)
          .from(".c02-daystats > div", { y: 16, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.4);
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // 9:14 pm sits a quarter of the way into the 9p segment.
  const pinLeft = `${((CALL_INDEX + 0.24) / HOURS.length) * 100}%`;

  return (
    <div ref={rootRef} className="c02-daybar-wrap">
      <div className="c02-daybar" role="img" aria-label="A 24-hour bar: the office is staffed nine hours, from 8 am to 5 pm. The other fifteen hours, plus weekends, the line rings out.">
        <span className="c02-daybar-pin" style={{ left: pinLeft }} aria-hidden="true">
          9:14 pm
        </span>
        {HOURS.map((h, i) => {
          const open = i >= OPEN_FROM && i < OPEN_TO;
          const call = i === CALL_INDEX;
          return (
            <div
              key={h}
              className={`c02-daybar-seg${open ? " is-open" : ""}${call ? " is-call" : ""}`}
            />
          );
        })}
      </div>
      <div className="c02-daybar-labels" aria-hidden="true">
        {HOURS.map((h, i) => (
          <span key={h}>{i % 3 === 0 ? h : ""}</span>
        ))}
      </div>
      <div className="c02-legend" aria-hidden="true">
        <span>
          <i style={{ background: "var(--tan-2)" }} />
          Someone at the desk
        </span>
        <span>
          <i style={{ background: "var(--night)" }} />
          Rings out
        </span>
        <span>
          <i style={{ background: "var(--brick)" }} />
          The 9:14 call
        </span>
      </div>

      <div className="c02-daystats">
        <div>
          <div className="c02-stat-k">9 hours</div>
          <div className="c02-stat-v">Someone is at the desk. Most calls get picked up.</div>
        </div>
        <div>
          <div className="c02-stat-k is-lost">15 hours</div>
          <div className="c02-stat-v">Rings out, every weekday. Voicemail, then the next shop.</div>
        </div>
        <div>
          <div className="c02-stat-k is-lost">All weekend</div>
          <div className="c02-stat-v">Plus holidays, storm days, and every hour your office manager is on the other line.</div>
        </div>
      </div>
    </div>
  );
}
