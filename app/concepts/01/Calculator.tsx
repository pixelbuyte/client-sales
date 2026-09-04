"use client";

import { useId, useState } from "react";

const MONTHLY = 750;

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Field({
  id,
  label,
  hint,
  prefix,
  value,
  onChange,
  step = 1,
  max,
}: {
  id: string;
  label: string;
  hint: string;
  prefix?: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  max: number;
}) {
  return (
    <div className="c1-field">
      <label htmlFor={id} className="c1-field-label">
        {label}
      </label>
      <div className="c1-input-wrap">
        {prefix ? <span className="c1-input-prefix">{prefix}</span> : null}
        <input
          id={id}
          className="c1-input"
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => {
            const n = Number(e.target.value);
            onChange(Number.isFinite(n) ? Math.max(0, Math.min(max, n)) : 0);
          }}
        />
      </div>
      <div className="c1-field-hint">{hint}</div>
    </div>
  );
}

// "Your numbers." Every figure here is the visitor's own guess, not a claim.
export function Calculator() {
  const uid = useId();
  const [call, setCall] = useState(350);
  const [calls, setCalls] = useState(3);
  const [replace, setReplace] = useState(9000);
  const [replaces, setReplaces] = useState(2);

  const fromCalls = call * calls;
  const fromQuotes = (replace * replaces) / 12;
  const total = Math.round(fromCalls + fromQuotes);
  const covered = total >= MONTHLY;
  const ratio = Math.min(1, MONTHLY / Math.max(1, total));

  return (
    <div className="c1-calc">
      <div className="c1-calc-head">
        <span className="c1-eyebrow c1-eyebrow--muted">Worked example — change anything to your numbers</span>
      </div>
      <div className="c1-calc-grid">
        <div className="c1-calc-fields">
          <Field
            id={`${uid}-call`}
            label="An after-hours service call is worth"
            hint="the ticket, not the profit — your number"
            prefix="$"
            value={call}
            onChange={setCall}
            step={25}
            max={5000}
          />
          <Field
            id={`${uid}-calls`}
            label="After-hours calls you'd recover in a month"
            hint="the weekly recap shows the real figure once live"
            value={calls}
            onChange={setCalls}
            max={200}
          />
          <Field
            id={`${uid}-replace`}
            label="A system replacement is worth"
            hint="your typical quote"
            prefix="$"
            value={replace}
            onChange={setReplace}
            step={500}
            max={100000}
          />
          <Field
            id={`${uid}-replaces`}
            label="Quiet estimates that turn into a yes, per year"
            hint="the ones that were never a no"
            value={replaces}
            onChange={setReplaces}
            max={200}
          />
        </div>

        <div className="c1-calc-out" aria-live="polite">
          <div className="c1-calc-row">
            <span>From after-hours calls, monthly</span>
            <b className="c1-mono">{money(fromCalls)}</b>
          </div>
          <div className="c1-calc-row">
            <span>From revived estimates, spread monthly</span>
            <b className="c1-mono">{money(Math.round(fromQuotes))}</b>
          </div>
          <div className="c1-calc-total">
            <span>Back on your book, per month (your numbers)</span>
            <b>{money(total)}</b>
          </div>
          <div className="c1-calc-vs">
            <div className="c1-bar" aria-hidden="true">
              <span className="c1-bar-fill" style={{ transform: `scaleX(${ratio})` }} />
            </div>
            <div className="c1-calc-vs-row">
              <span>
                What it costs once live: <b>{money(MONTHLY)}</b>/month
              </span>
              <span className={covered ? "c1-good" : "c1-bad"}>
                {covered
                  ? `${(total / MONTHLY).toFixed(1)}× the monthly`
                  : "below the monthly — don't buy this"}
              </span>
            </div>
          </div>
          <p className="c1-calc-note">
            We don&apos;t know your close rate or your average ticket, and we won&apos;t pretend to.
            The only point is that the monthly is priced below one recovered job for most shops
            this size. If your numbers say otherwise, you shouldn&apos;t buy it.
          </p>
        </div>
      </div>
    </div>
  );
}
