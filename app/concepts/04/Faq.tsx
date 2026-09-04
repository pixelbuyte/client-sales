"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Do I have to change my phone number or phone system?",
    a: "No. Your number stays yours and your existing setup stays as it is. We work alongside it. Figuring out exactly how is what the setup call is for.",
  },
  {
    q: "I already have an answering service. Is this the same thing?",
    a: "No, and you can keep it. An answering service picks up live calls. This catches what falls through anyway: the hang-ups, the after-hours calls that never leave a message, and the estimates that go quiet weeks later.",
  },
  {
    q: "What do my techs have to do differently?",
    a: "Nothing. There's nothing to install, nothing to log into, no training day. Recovered jobs show up the same way any other booked job does.",
  },
  {
    q: "How long until it's actually running?",
    a: "Days, not months, once the setup fee clears and we've had the configuration call. We don't flip it live until you've heard it working with your own calls.",
  },
  {
    q: "What if it doesn't recover anything?",
    a: "Then you cancel the monthly and you've spent the setup fee finding that out. We'd rather tell you on the call that your shop isn't a fit than take the setup fee and disappoint you.",
  },
  {
    q: "Why pay the whole setup up front?",
    a: "Because the work happens up front. The build and configuration are done before you ever see it run. That's what the setup fee covers, and it's why the monthly doesn't start until go-live.",
  },
  {
    q: "Is there a contract?",
    a: "Month to month. No revenue share, no per-call fee, no long contract. Cancel any time and the monthly stops.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="c04-faq" data-reveal>
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        const id = `c04-faq-${i}`;
        return (
          <div className={`c04-faq-item ${isOpen ? "is-open" : ""}`} key={f.q}>
            <h3>
              <button
                type="button"
                className="c04-faq-q"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="c04-num">{String(i + 1).padStart(2, "0")}</span>
                <span>{f.q}</span>
                <span className="c04-faq-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M8 2v12M2 8h12" />
                  </svg>
                </span>
              </button>
            </h3>
            <div className="c04-faq-a" id={id} role="region" aria-hidden={!isOpen}>
              <div>
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
