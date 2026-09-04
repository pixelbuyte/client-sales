"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, CINEMATIC } from "./motion";

type Props = { children: ReactNode; className?: string; amount?: number };

// A slow vertical drift on an illustration as it passes through the
// viewport. Desktop and motion-allowed only; otherwise it just sits there.
export function Parallax({ children, className, amount = 14 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(CINEMATIC, () => {
        gsap.fromTo(
          el.firstElementChild,
          { yPercent: amount },
          {
            yPercent: -amount,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
