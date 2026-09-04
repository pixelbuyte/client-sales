"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Do I have to change my phone number or phone system?",
    a: "No. Your number stays yours and whatever you run jobs with today stays as it is. We work alongside it — that's part of what the setup call is for.",
  },
  {
    q: "I already have an answering service. Is this the same thing?",
    a: "No, and you can keep it. An answering service picks up live calls. This catches what falls through anyway — the hang-ups, the after-hours calls that never leave a message, and the estimates that go quiet weeks later.",
  },
  {
    q: "What do my techs have to do differently?",
    a: "Nothing. There's no app, no login, no new process on the truck. Recovered jobs land with your team the same way any other booked job does.",
  },
  {
    q: "How long until it's actually running?",
    a: "Days, not months, once the setup fee clears and we've had the configuration call. We won't flip it live until you've heard it working with your own calls.",
  },
  {
    q: "When does the $750 start?",
    a: "The day your system goes live — never the day you sign. If the build takes us longer than we said, that's our cost, not yours.",
  },
  {
    q: "What if it doesn't recover anything?",
    a: "Then you cancel the monthly and you've spent the setup fee finding that out. We'd rather tell you on the call that your shop isn't a fit than take the fee and disappoint you.",
  },
  {
    q: "Why pay the whole setup up front?",
    a: "Because the work happens up front. The build and configuration are done before you ever see it run — that's what the setup fee covers, and it's why the monthly doesn't start until go-live.",
  },
  {
    q: "Is there a contract?",
    a: "Month to month. No revenue share, no per-call fee, no long contract. Stop whenever it stops paying for itself.",
  },
];

export function Faq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="c1-faq">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        const panelId = `${uid}-p-${i}`;
        const btnId = `${uid}-b-${i}`;
        return (
          <div key={f.q} className={`c1-faq-item ${isOpen ? "is-open" : ""}`} data-rise>
            <h3 className="c1-faq-h">
              <button
                id={btnId}
                type="button"
                className="c1-faq-q"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{f.q}</span>
                <Plus size={18} strokeWidth={2.2} aria-hidden="true" className="c1-faq-icon" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className="c1-faq-a">
              <div className="c1-faq-a-inner">
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
