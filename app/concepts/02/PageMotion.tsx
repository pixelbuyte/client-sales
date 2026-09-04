"use client";

import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger, SplitText, MOTION_OK, EASE } from "./gsapSetup";

// Page-wide scroll choreography driven by data attributes so the server
// components stay plain markup:
//   data-split     headline: SplitText line-mask reveal
//   data-reveal    group: children marked data-r rise in with a stagger
//                  (or the element itself if it has no data-r children)
//   data-develop   illustration: clip-path develops from the bottom
//   data-parallax  wrapper: slow scrub on yPercent (value = distance)
//   .c02-rule      eyebrow rule draws from the left
// Everything is gsap.from(), so the server-rendered page is fully visible
// if JS never runs, and prefers-reduced-motion simply skips all of it.
export function PageMotion() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".c02");
    if (!root) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add(MOTION_OK, () => {
          // Headlines
          root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              linesClass: "line",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 1.05,
                  ease: "power4.out",
                  stagger: 0.09,
                  scrollTrigger: { trigger: el, start: "top 88%", once: true },
                }),
            });
          });

          // Eyebrow rules
          root.querySelectorAll<HTMLElement>(".c02-rule").forEach((el) => {
            gsap.from(el, {
              scaleX: 0,
              duration: 0.9,
              ease: EASE,
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            });
          });

          // Staggered groups
          root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
            const kids = el.querySelectorAll<HTMLElement>("[data-r]");
            const targets = kids.length ? Array.from(kids) : [el];
            gsap.from(targets, {
              y: 26,
              opacity: 0,
              duration: 0.9,
              ease: EASE,
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: "top 86%", once: true },
            });
          });

          // Illustrations develop from the bottom
          root.querySelectorAll<HTMLElement>("[data-develop]").forEach((el) => {
            gsap.from(el, {
              clipPath: "inset(100% 0% 0% 0%)",
              duration: 1.1,
              ease: "power3.inOut",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          });

          // Lines that draw from the left (go-live timeline)
          root.querySelectorAll<HTMLElement>("[data-draw]").forEach((el) => {
            gsap.from(el, {
              scaleX: 0,
              duration: 1.4,
              ease: "power3.inOut",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          });

          // Gentle parallax on illustration wrappers
          root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
            const amt = Number(el.dataset.parallax || 10);
            gsap.fromTo(
              el,
              { yPercent: amt },
              {
                yPercent: -amt,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          });
        });

        ScrollTrigger.refresh();
      }, root);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
