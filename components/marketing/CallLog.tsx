"use client";

import { useState } from "react";

type Call = {
  time: string;
  town: string;
  issue: string;
  lost: string;
  recovered: string;
  /** Calls the office would have caught anyway — same either way. */
  alwaysCaught?: boolean;
};

const CALLS: Call[] = [
  { time: "21:14", town: "Quincy", issue: "No heat — furnace won't fire", lost: "No answer", recovered: "Booked 7:20a" },
  { time: "22:03", town: "Braintree", issue: "Boiler leaking water", lost: "No answer", recovered: "Booked 8:00a" },
  { time: "23:41", town: "Weymouth", issue: "No heat, infant in house", lost: "No answer", recovered: "Urgent · dispatched" },
  { time: "02:17", town: "Milton", issue: "Thermostat blank", lost: "No answer", recovered: "Booked 9:15a" },
  { time: "05:52", town: "Randolph", issue: "No heat upstairs only", lost: "No answer", recovered: "Booked 11:30a" },
  { time: "06:30", town: "Quincy", issue: "Question on estimate #2213", lost: "No answer", recovered: "Replied" },
  { time: "07:05", town: "Hingham", issue: "AC replacement quote", lost: "Answered", recovered: "Answered", alwaysCaught: true },
];

export function CallLog() {
  const [on, setOn] = useState(false);

  const recoverable = CALLS.filter((c) => !c.alwaysCaught).length;
  const caught = on ? recoverable : 0;

  return (
    <div className="overflow-hidden rounded-lg border border-night-line bg-night-surface shadow-[0_24px_70px_-30px_rgba(0,0,0,0.9)]">
      {/* Console header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-night-line bg-night-raised px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-ember" />
          <span className="font-code text-[11px] uppercase tracking-[0.16em] text-night-muted">
            After-hours call log
          </span>
          <span className="hidden font-code text-[11px] text-night-muted/60 sm:inline">
            · Tue–Wed overnight
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          aria-pressed={on}
          className="group flex items-center gap-2.5 rounded-full border border-night-line bg-night-bg px-3 py-1.5 transition-colors hover:border-ember/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember/60"
        >
          <span className="font-code text-[10px] uppercase tracking-[0.14em] text-night-muted">
            Recovery
          </span>
          <span
            className={`relative h-4 w-8 rounded-full transition-colors duration-300 ${
              on ? "bg-ember" : "bg-night-line"
            }`}
          >
            <span
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-night-bg transition-transform duration-300 ${
                on ? "translate-x-[18px]" : "translate-x-0.5"
              }`}
            />
          </span>
          <span
            className={`w-7 text-left font-code text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
              on ? "text-ember" : "text-night-muted"
            }`}
          >
            {on ? "On" : "Off"}
          </span>
        </button>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-night-line/70">
        {CALLS.map((call, i) => {
          const missed = !call.alwaysCaught;
          const won = on && missed;
          return (
            <li
              key={call.time}
              className="log-row grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-3 sm:grid-cols-[4rem_7rem_1fr_auto]"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <span className="font-code text-xs tabular-nums text-night-muted">{call.time}</span>
              <span className="hidden font-code text-xs text-night-muted/80 sm:block">
                {call.town}
              </span>
              <span
                className={`truncate text-sm transition-colors duration-300 ${
                  missed && !on ? "text-night-muted" : "text-night-ink"
                }`}
              >
                <span className="text-night-muted sm:hidden">{call.town} · </span>
                {call.issue}
              </span>
              <span
                className={`justify-self-end whitespace-nowrap rounded-sm px-2 py-1 font-code text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                  call.alwaysCaught
                    ? "bg-night-line/60 text-night-muted"
                    : won
                      ? "bg-signal-ok/15 text-signal-ok"
                      : "bg-signal-lost/15 text-signal-lost"
                }`}
              >
                {on ? call.recovered : call.lost}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Console footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-night-line bg-night-raised px-4 py-3">
        <span className="font-code text-[11px] uppercase tracking-[0.14em] text-night-muted">
          {caught} of {recoverable} after-hours calls recovered
        </span>
        <span
          className={`font-code text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
            on ? "text-signal-ok" : "text-signal-lost"
          }`}
        >
          {on ? "Back on the schedule" : "Gone to the next shop"}
        </span>
      </div>
    </div>
  );
}
