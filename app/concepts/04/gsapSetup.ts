"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
};

export type NavTheme = "dark" | "light";

// The sticky nav inverts as it passes over navy and paper panels. Sections
// tell it which is underneath; pinned sections update it from their scrub.
export function setNavTheme(theme: NavTheme) {
  const nav = document.querySelector<HTMLElement>(".c04-nav");
  if (nav && nav.dataset.theme !== theme) nav.dataset.theme = theme;
}

export { gsap, ScrollTrigger, SplitText };
