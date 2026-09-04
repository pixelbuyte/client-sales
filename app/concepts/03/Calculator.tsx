"use client";

import { useId, useMemo, useState } from "react";

const MONTHLY = 750;

type Field = {
  key: "calls" | "callValue" | "quiet" | "quoteValue" | "share";
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
};

const FIELDS: Field[] = [
  {
    key: "calls",
    label: "Calls that ring out in a month",
    hint: "nights, weekends, and while the desk is on another line",
    min: 2,
    max: 40,
    step: 1,
    format: (n) => `${n}`,
  },
  {
    key: "callValue",
    label: "What a service call is worth to you",
    hint: "the ticket, not the profit — use your own average",
    min: 150,
    max: 900,
    step: 10,
    format: (n) => `$${n}`,
  },
  {
    key: "quiet",
    label: "Written estimates that go quiet in a month",
    hint: "sent, not declined, never answered",
    min: 0,
    max: 12,
    step: 1,
    format: (n) => `${n}`,
  },
  {
    key: "quoteValue",
    label: "What a replacement quote is worth",
    hint: "your typical system swap",
    min: 3000,
    max: 25000,
    step: 250,
    format: (n) => `$${n.toLocaleString("en-US")}`,
  },
  {
    key: "share",
    label: "Share you think you'd win back",
    hint: "be stingy — one in four is a fair place to start",
    min: 5,
    max: 60,
    step: 5,
    format: (n) => `${n}%`,
  },
];

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function Calculator() {
  const id = useId();
  const [v, setV] = useState({ calls: 12, callValue: 350, quiet: 3, quoteValue: 9000, share: 25 });

  const out = useMemo(() => {
    const share = v.share / 100;
    const calls = v.calls * v.callValue * share;
    const quotes = v.quiet * v.quoteValue * share;
    const total = calls + quotes;
    return { calls, quotes, total, ratio: total / MONTHLY };
  }, [v]);

  const thin = out.total < MONTHLY;

  return (
    <div className="c03-calc">
      <div className="c03-clip" data-reveal>
        <div className="c03-clip-clamp" aria-hidden="true" />
        <form className="c03-clip-sheet" onSubmit={(e) => e.preventDefault()}>
          <div className="c03-clip-title">Your numbers, not ours</div>
          {FIELDS.map((f) => {
            const val = v[f.key];
            const pct = ((val - f.min) / (f.max - f.min)) * 100;
            const inputId = `${id}-${f.key}`;
            return (
              <div className="c03-field" key={f.key}>
                <div className="c03-field-row">
                  <label htmlFor={inputId}>
                    {f.label}
                    <span className="c03-field-hint">{f.hint}</span>
                  </label>
                  <output htmlFor={inputId} aria-live="off">
                    {f.format(val)}
                  </output>
                </div>
                <input
                  id={inputId}
                  className="c03-range"
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={val}
                  style={{ ["--pct" as string]: `${pct}%` }}
                  onChange={(e) => setV((s) => ({ ...s, [f.key]: Number(e.target.value) }))}
                />
              </div>
            );
          })}
        </form>
      </div>

      <div>
        <div className="c03-calc-result" data-reveal aria-live="polite">
          <div className="c03-calc-line">
            <span>Calls won back, per month</span>
            <b>{fmt(out.calls)}</b>
          </div>
          <div className="c03-calc-line">
            <span>Estimates that answer, per month</span>
            <b>{fmt(out.quotes)}</b>
          </div>
          <div className="c03-calc-total">
            <div className="c03-calc-total-k">recovered, on your numbers</div>
            <div className={`c03-calc-total-v ${thin ? "is-thin" : ""}`}>{fmt(out.total)}</div>
          </div>
          <div className="c03-calc-vs">
            <span>
              Monthly, once live: <b>{fmt(MONTHLY)}</b>
            </span>
            <span>
              That&apos;s <b>{out.ratio.toFixed(1)}×</b> the monthly
            </span>
          </div>
          <p className="c03-calc-verdict">
            {thin
              ? "On these numbers it's thin. Don't buy it — or run it again with a month you actually remember, and see if it still looks thin."
              : "One recovered job is most of the conversation. The rest of the month is the part nobody was counting."}
          </p>
        </div>
        <p className="c03-calc-fine">
          We don&apos;t know your close rate or your average ticket, and we won&apos;t pretend to.
          The point is that the monthly is priced under one recovered job for most shops running 5
          to 30 trucks — and if it isn&apos;t for yours, you shouldn&apos;t buy this.
        </p>
      </div>
    </div>
  );
}
