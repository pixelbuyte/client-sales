"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

// Media conditions shared by every animated piece on the page.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 1024px)";
export const CINEMATIC = `${DESKTOP} and ${MOTION_OK}`;

export function motionAllowed(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MOTION_OK).matches;
}

export function isDesktop(): boolean {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP).matches;
}
