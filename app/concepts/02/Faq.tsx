"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { gsap } from "./gsapSetup";

const FAQS = [
  {
    q: "Do I have to change my phone number or phone system?",
    a: "No. Your number stays yours and your existing setup stays as it is. We work alongside it — that's part of what the setup call is for.",
  },
  {
    q: "I already have an answering service. Is this the same thing?",
    a: "No, and you can keep it. An answering service picks up live calls. This catches what falls through anyway — the hang-ups, the after-hours calls that never leave a message, and the estimates that go quiet weeks later.",
  },
  {
    q: "What do my techs have to do differently?",
    a: "Nothing. There's nothing to install, no login, no new process on the truck. Recovered jobs show up the same way any other booked job does, in whatever you run jobs with today.",
  },
  {
    q: "How long until it's actually running?",
    a: "Typically days, not months, once the setup fee clears and we've had the configuration call. We won't flip it live until you've heard it working with your own calls.",
  },
  {
    q: "When does the $750 a month start?",
    a: "The day your system goes live. Never at signing. If go-live is three weeks after you pay the setup fee, the first monthly is three weeks after you pay the setup fee.",
  },
  {
    q: "What if it doesn't recover anything?",
    a: "Then you cancel the monthly and you've spent the setup fee finding that out. We'd rather tell you on the 15-minute call that your shop isn't a fit than take the setup fee and disappoint you.",
  },
  {
    q: "Why pay the whole setup up front?",
    a: "Because the work happens up front. The build and configuration are done before you ever see it run — that's what the setup fee covers, and it's why the monthly doesn't start until go-live.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number>(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? -1 : i;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 0 : 0.55;

    panels.current.forEach((p, idx) => {
      if (!p) return;
      const shouldOpen = idx === next;
      const isOpen = idx === open;
      if (shouldOpen === isOpen) return;
      gsap.killTweensOf(p);
      // The one place on the page that tweens height: to "auto" and back to 0.
      gsap.to(p, { height: shouldOpen ? "auto" : 0, duration: dur, ease: "power3.inOut" });
    });
    setOpen(next);
  };

  return (
    <div className="c02-faq-list">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        const id = `c02-faq-${i}`;
        return (
          <div className="c02-faq-item" key={f.q}>
            <h3>
              <button
                type="button"
                className="c02-faq-btn"
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                id={`${id}-btn`}
                onClick={() => toggle(i)}
              >
                <span>{f.q}</span>
                <span className="c02-faq-icon" aria-hidden="true">
                  <Plus size={16} strokeWidth={2.2} />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-panel`}
              role="region"
              aria-labelledby={`${id}-btn`}
              className="c02-faq-panel"
              ref={(el) => {
                panels.current[i] = el;
              }}
              style={{ height: i === 0 ? "auto" : 0 }}
            >
              <p>{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
