"use client";

import { gsap } from "./gsapSetup";

/**
 * Rubber-stamp landing: the stamp comes down from 1.6x with a bounce and the
 * ticket underneath takes a short shake. Returns the timeline so callers can
 * sequence it.
 */
export function stampIn(stamp: Element, ticket: Element | null, delay = 0) {
  const tl = gsap.timeline({ delay });
  tl.fromTo(
    stamp,
    { opacity: 0, scale: 1.6, rotation: "+=6" },
    { opacity: 1, scale: 1, rotation: "-=6", duration: 0.42, ease: "back.out(3)", overwrite: "auto" },
  );
  if (ticket) {
    tl.to(
      ticket,
      {
        keyframes: [
          { x: -3, y: 2, rotation: -0.6, duration: 0.05 },
          { x: 3, y: -1, rotation: 0.5, duration: 0.06 },
          { x: -2, y: 1, rotation: -0.3, duration: 0.06 },
          { x: 0, y: 0, rotation: 0, duration: 0.1 },
        ],
        overwrite: "auto",
      },
      "-=0.18",
    );
  }
  return tl;
}

/** Lift a stamp off the ticket — the reverse of stampIn, quick and quiet. */
export function stampOut(stamp: Element) {
  return gsap.to(stamp, { opacity: 0, scale: 0.92, duration: 0.18, ease: "power2.in", overwrite: "auto" });
}

/** Ticket fly-in: from below with a slight per-ticket lean and an elastic settle. */
export function flyInVars(i: number, extra: gsap.TweenVars = {}): gsap.TweenVars {
  return {
    y: 90,
    opacity: 0,
    rotation: i % 2 === 0 ? -5 : 5,
    transformOrigin: "50% 0%",
    duration: 1.25,
    ease: "elastic.out(1, 0.62)",
    ...extra,
  };
}

/**
 * Subtle magnet-follow for tickets on a board: the tickets lean a few pixels
 * toward the pointer. Desktop fine-pointer only; caller guards for motion.
 */
export function attachMagnet(zone: HTMLElement, selector: string, strength = 7) {
  const items = Array.from(zone.querySelectorAll<HTMLElement>(selector));
  const setters = items.map((el) => ({
    el,
    x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }),
    y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }),
  }));
  let raf = 0;
  let px = 0;
  let py = 0;

  const apply = () => {
    raf = 0;
    for (const s of setters) {
      const r = s.el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.max(r.width, 260);
      const f = Math.max(0, 1 - dist / reach) * strength;
      s.x((dx / dist) * f);
      s.y((dy / dist) * f);
    }
  };

  const onMove = (e: PointerEvent) => {
    px = e.clientX;
    py = e.clientY;
    if (!raf) raf = requestAnimationFrame(apply);
  };
  const onLeave = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    for (const s of setters) {
      s.x(0);
      s.y(0);
    }
  };

  zone.addEventListener("pointermove", onMove);
  zone.addEventListener("pointerleave", onLeave);
  return () => {
    zone.removeEventListener("pointermove", onMove);
    zone.removeEventListener("pointerleave", onLeave);
    if (raf) cancelAnimationFrame(raf);
  };
}
