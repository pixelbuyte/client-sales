"use client";

import { useId, useState } from "react";

// Your numbers, not ours. Every input is the owner's guess; the output is
// arithmetic on those guesses, shown next to the $750 monthly.

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

type FieldProps = {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
};

function Field({ label, hint, value, min, max, step, format, onChange }: FieldProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="c04-field">
      <label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id}>{format(value)}</output>
      </label>
      <small>{hint}</small>
      <input
        id={id}
        className="c04-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--pct" as string]: `${pct}%` }}
      />
    </div>
  );
}

export function Calculator() {
  const [missed, setMissed] = useState(4);
  const [callValue, setCallValue] = useState(350);
  const [quiet, setQuiet] = useState(3);
  const [quoteValue, setQuoteValue] = useState(9000);
  const [winRate, setWinRate] = useState(4);

  const callsMonthly = (missed * 52) / 12;
  const recoveredCalls = (callsMonthly * callValue) / winRate;
  const recoveredQuotes = (quiet * quoteValue) / winRate;
  const total = recoveredCalls + recoveredQuotes;
  const monthsPerQuote = quoteValue / 750;

  return (
    <div className="c04-calc" data-reveal>
      <div className="c04-calc-in">
        <Field
          label="After-hours calls that ring out"
          hint="per week — nights, weekends, storm days"
          value={missed}
          min={0}
          max={20}
          step={1}
          format={(v) => `${v} / wk`}
          onChange={setMissed}
        />
        <Field
          label="What a no-heat service call is worth"
          hint="your average ticket, not ours"
          value={callValue}
          min={100}
          max={1000}
          step={25}
          format={money}
          onChange={setCallValue}
        />
        <Field
          label="Written estimates that go quiet"
          hint="per month — sent, never answered"
          value={quiet}
          min={0}
          max={10}
          step={1}
          format={(v) => `${v} / mo`}
          onChange={setQuiet}
        />
        <Field
          label="Average replacement estimate"
          hint="the ones that go quiet tend to be the big ones"
          value={quoteValue}
          min={2000}
          max={20000}
          step={500}
          format={money}
          onChange={setQuoteValue}
        />
        <Field
          label="Say you win back one in"
          hint="be pessimistic — the math still has to work"
          value={winRate}
          min={2}
          max={10}
          step={1}
          format={(v) => `1 in ${v}`}
          onChange={setWinRate}
        />
      </div>

      <div className="c04-calc-out" aria-live="polite">
        <div className="c04-eyebrow">Your numbers, per month</div>
        <div className="c04-num c04-calc-big">
          {money(total)}
          <small>recovered</small>
        </div>
        <div className="c04-calc-vs">
          <div>
            <span>From after-hours calls</span>
            <b>{money(recoveredCalls)}</b>
          </div>
          <div>
            <span>From quiet estimates</span>
            <b>{money(recoveredQuotes)}</b>
          </div>
          <div>
            <span>Monthly, once live</span>
            <b>$750</b>
          </div>
          <div>
            <span>One won-back replacement covers</span>
            <b>
              {monthsPerQuote >= 1 ? `${Math.floor(monthsPerQuote)} month${Math.floor(monthsPerQuote) === 1 ? "" : "s"}` : "less than a month"}
            </b>
          </div>
        </div>
        <p className="c04-calc-note">
          This is a worked example on your inputs, not a promise. We don&apos;t know your close rate or
          your ticket. If the number above isn&apos;t comfortably more than $750 at your own pessimistic
          guesses, you shouldn&apos;t buy this — and we&apos;ll say so on the call.
        </p>
      </div>
    </div>
  );
}
