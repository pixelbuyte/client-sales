"use client";

import { useState } from "react";

type Ticket = {
  no: string;
  at: string;
  name: string;
  town: string;
  said: string;
  booked: string;
};

// Real people with real complaints, in their own words. The point of this
// visual is that these are your customers — not log lines.
const TICKETS: Ticket[] = [
  {
    no: "2211",
    at: "9:14 pm",
    name: "Dana R.",
    town: "Quincy",
    said: "Furnace won't fire, house is down to 54.",
    booked: "Booked 7:30 am",
  },
  {
    no: "2212",
    at: "11:41 pm",
    name: "Marcus T.",
    town: "Weymouth",
    said: "No heat and we have a newborn here.",
    booked: "Escalated tonight",
  },
  {
    no: "2213",
    at: "6:30 am",
    name: "Joanne P.",
    town: "Milton",
    said: "Had a question on the replacement quote.",
    booked: "Replied — closed",
  },
];

// Sits on the dark hero band, so the frame is translucent white on navy and
// the tickets themselves are the brightest thing in the block.
export function JobTickets() {
  const [on, setOn] = useState(false);

  return (
    <div>
      {/* Switch — deliberately styled as a shop control, not a console toggle */}
      <div className="mb-4 flex items-center justify-between gap-4 rounded-ticket border border-white/15 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 font-serif text-lg leading-none text-white">
            {on ? (
              <span className="live-dot h-2 w-2 rounded-full bg-stamp-booked" aria-hidden />
            ) : null}
            {on ? "Tuesday night, covered" : "Tuesday night, as it stands"}
          </div>
          <div className="mt-1.5 text-[13px] text-white/60">
            {on ? "Every call answered and back on the book." : "Three calls after close. Nobody at the desk."}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          aria-pressed={on}
          className="flex shrink-0 items-center gap-3 rounded-full border border-white/20 bg-white/10 py-2 pl-3 pr-4 transition-colors hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/60"
        >
          <span
            className={`relative block h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${
              on ? "bg-stamp-booked" : "bg-white/25"
            }`}
          >
            <span
              className={`absolute left-0 top-[3px] h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-300 ${
                on ? "translate-x-[19px]" : "translate-x-[3px]"
              }`}
            />
          </span>
          {/* Fixed width so the control doesn't resize between states */}
          <span className="w-[52px] text-left text-[13px] font-medium text-white">
            {on ? "Covered" : "Turn on"}
          </span>
        </button>
      </div>

      {/* The tickets */}
      <div className="space-y-3">
        {TICKETS.map((t, i) => (
          <article
            key={t.no}
            className={`ticket-card ticket-in relative overflow-hidden rounded-ticket border bg-sea-surface p-4 pr-28 sm:pr-32 ${
              on
                ? "-translate-y-0.5 border-stamp-booked/40 shadow-lift"
                : "border-white/30 shadow-ticket"
            }`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {/* Perforated left edge, like a torn work order */}
            <span
              aria-hidden
              className={`absolute inset-y-0 left-0 w-1 transition-colors duration-500 ${
                on ? "bg-stamp-booked" : "bg-stamp-missed/70"
              }`}
            />

            <div className="flex items-baseline gap-2">
              <span className="font-code text-[11px] text-sea-muted">#{t.no}</span>
              <span className="text-[13px] text-sea-muted">{t.at}</span>
            </div>

            <div className="mt-1 font-serif text-[19px] leading-tight text-sea-ink">
              {t.name} <span className="text-sea-muted">· {t.town}</span>
            </div>

            <p className="mt-1 text-[14px] leading-snug text-sea-muted">&ldquo;{t.said}&rdquo;</p>

            {/* Rubber stamp */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div
                className={`stamp-mark rotate-[-8deg] rounded-md border-2 px-2.5 py-1 text-center ${
                  on
                    ? "border-stamp-booked/70 bg-stamp-booked-bg text-stamp-booked"
                    : "border-stamp-missed/50 bg-stamp-missed-bg text-stamp-missed"
                }`}
                style={{ transform: on ? "rotate(-8deg) scale(1)" : "rotate(-8deg) scale(0.96)" }}
              >
                <div className="text-[11px] font-bold uppercase leading-none tracking-wider">
                  {on ? "Booked" : "Missed"}
                </div>
                {on ? (
                  <div className="mt-1 text-[10px] leading-none opacity-80">
                    {t.booked.replace("Booked ", "")}
                  </div>
                ) : (
                  <div className="mt-1 text-[10px] leading-none opacity-80">no answer</div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 text-center text-[13px] text-white/60">
        {on ? (
          <>
            Three jobs that would have gone to the next shop.{" "}
            <button
              type="button"
              onClick={() => setOn(false)}
              className="font-medium text-white underline underline-offset-2"
            >
              See it the other way
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOn(true)}
              className="font-medium text-white underline underline-offset-2"
            >
              Turn recovery on
            </button>{" "}
            and watch the same night end differently.
          </>
        )}
      </p>
    </div>
  );
}
