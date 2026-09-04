"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, motionAllowed } from "./motion";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// Renders the final number on the server. On the client it counts up when
// it scrolls into view. Reduced motion: nothing moves.
export function Count({ value, prefix = "", suffix = "", className, duration = 1.4 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;

    const obj = { v: 0 };
    const write = () => {
      el.textContent = `${prefix}${fmt(obj.v)}${suffix}`;
    };
    // Below the fold? Start from zero so the count-up is visible.
    if (el.getBoundingClientRect().top > window.innerHeight * 0.9) write();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(obj, { v: value, duration, ease: "power2.out", onUpdate: write });
        },
      });
    });
    return () => {
      ctx.revert();
      obj.v = value;
      write();
    };
  }, [value, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {fmt(value)}
      {suffix}
    </span>
  );
}
