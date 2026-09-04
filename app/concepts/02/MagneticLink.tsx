"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "./gsapSetup";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

// Primary CTA with a magnetic pull on desktop pointers only. The link is a
// plain anchor underneath — the effect is purely transform, so nothing about
// layout, focus, or keyboard use changes.
export function MagneticLink({ href, className, children }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * 0.22);
      yTo(dy * 0.28);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, []);

  return (
    <Link ref={ref} href={href} className={className}>
      {children}
    </Link>
  );
}
