"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsapSetup";

const MONTHLY = 750;

type Field = {
  key: "service" | "replacement" | "calls";
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
};

const FIELDS: Field[] = [
  {
    key: "service",
    label: "Average service ticket",
    hint: "A no-heat call, after hours — parts and labor.",
    min: 100,
    max: 1500,
    step: 5,
    prefix: "$",
  },
  {
    key: "replacement",
    label: "Average replacement ticket",
    hint: "A system swap you'd quote and, sometimes, lose to silence.",
    min: 2000,
    max: 30000,
    step: 100,
    prefix: "$",
  },
  {
    key: "calls",
    label: "Recovered calls in a month",
    hint: "After-hours calls that turn into a booked job. Guess low.",
    min: 0,
    max: 40,
    step: 1,
  },
];

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

function useCountUp(value: number, format: (n: number) => string) {
  const ref = useRef<HTMLElement>(null);
  const live = useRef({ v: value });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      live.current.v = value;
      el.textContent = format(value);
      return;
    }
    const tween = gsap.to(live.current, {
      v: value,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = format(live.current.v);
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, format]);
  return ref;
}

export function Calculator() {
  const [vals, setVals] = useState({ service: 385, replacement: 9400, calls: 6 });

  const serviceMonth = vals.calls * vals.service;
  const net = serviceMonth - MONTHLY;
  const withOne = serviceMonth + vals.replacement;
  const jobsToCover = vals.service > 0 ? Math.ceil(MONTHLY / vals.service) : 0;

  const bigRef = useCountUp(serviceMonth, fmt);
  const netRef = useCountUp(net, (n) => (n < 0 ? "−" + fmt(-n) : fmt(n)));
  const oneRef = useCountUp(withOne, fmt);

  const set = (key: Field["key"], raw: string, f: Field) => {
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    setVals((v) => ({ ...v, [key]: Math.min(f.max, Math.max(0, n)) }));
  };

  return (
    <div className="c02-calc">
      <div className="c02-calc-inputs">
        <div className="c02-calc-title">Your numbers — type over ours</div>
        {FIELDS.map((f) => {
          const v = vals[f.key];
          const pct = Math.max(0, Math.min(100, ((v - f.min) / (f.max - f.min)) * 100));
          const id = `c02-in-${f.key}`;
          return (
            <div className="c02-field" key={f.key}>
              <div className="c02-field-row">
                <label htmlFor={id}>
                  {f.label}
                  <span className="c02-field-hint">{f.hint}</span>
                </label>
                <div className="c02-field-num">
                  {f.prefix ? <span>{f.prefix}</span> : null}
                  <input
                    id={id}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={f.max}
                    step={f.step}
                    value={v}
                    onChange={(e) => set(f.key, e.target.value, f)}
                  />
                </div>
              </div>
              <input
                className="c02-range"
                type="range"
                aria-label={`${f.label} (slider)`}
                min={f.min}
                max={f.max}
                step={f.step}
                value={Math.min(f.max, Math.max(f.min, v))}
                onChange={(e) => set(f.key, e.target.value, f)}
                style={{ ["--pct" as string]: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="c02-calc-out" aria-live="polite">
        <div className="c02-calc-title">Service work back on the board, per month</div>
        <div className="c02-out-big">
          <span ref={bigRef as React.RefObject<HTMLSpanElement>}>{fmt(serviceMonth)}</span>
        </div>
        <div className="c02-out-label">
          {vals.calls} recovered {vals.calls === 1 ? "call" : "calls"} × {fmt(vals.service)} a ticket. Before
          a single replacement.
        </div>

        <div className="c02-out-rows">
          <div className="c02-out-row is-cost">
            <span>What this costs you monthly, once live</span>
            <b>{fmt(MONTHLY)}</b>
          </div>
          <div className="c02-out-row is-net">
            <span>Left over, on service calls alone</span>
            <b ref={netRef as React.RefObject<HTMLElement>}>{net < 0 ? "−" + fmt(-net) : fmt(net)}</b>
          </div>
          <div className="c02-out-row">
            <span>If one quiet estimate a month comes back</span>
            <b ref={oneRef as React.RefObject<HTMLElement>}>{fmt(withOne)}</b>
          </div>
          <div className="c02-out-row">
            <span>Service calls it takes to cover the monthly</span>
            <b>{jobsToCover}</b>
          </div>
        </div>
        <p className="c02-out-note">
          Your numbers, not our claim. We don&apos;t know your close rate or your average ticket — you
          do. If the math doesn&apos;t work at your numbers, don&apos;t buy this.
        </p>
      </div>

      <p className="c02-calc-foot">
        The monthly is priced to sit under one recovered service call for most shops this size,
        and a long way under one recovered replacement. The weekly recap shows you which it was.
      </p>
    </div>
  );
}
