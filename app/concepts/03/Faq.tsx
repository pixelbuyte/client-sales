"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

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
    q: "What if it doesn't recover anything?",
    a: "Then you cancel the monthly and you've spent the setup fee finding that out. We'd rather tell you on the call that your shop isn't a fit than take the setup fee and disappoint you.",
  },
  {
    q: "Why pay the whole setup up front?",
    a: "Because the work happens up front. The build and configuration are done before you ever see it run — so that's what the setup fee covers, and it's why the monthly doesn't start until go-live.",
  },
  {
    q: "What does the weekly recap actually show?",
    a: "Who called, when, what they said, and what happened next — booked, flagged, replied, or still open. It's the board in the hero, for your real week.",
  },
  {
    q: "Is there a contract?",
    a: "No. Month to month, cancel any time. No revenue share, no per-call fee. The setup fee is the only thing you pay before it's live.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number>(0);
  const id = useId();

  return (
    <div className="c03-faq">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        const panelId = `${id}-panel-${i}`;
        const btnId = `${id}-btn-${i}`;
        return (
          <div className="c03-faq-item" key={f.q} data-reveal>
            <h3>
              <button
                type="button"
                id={btnId}
                className="c03-faq-q"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{f.q}</span>
                <span className="c03-faq-icon" aria-hidden="true">
                  <Plus size={18} strokeWidth={2.6} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`c03-faq-a ${isOpen ? "is-open" : ""}`}
              aria-hidden={!isOpen}
            >
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
