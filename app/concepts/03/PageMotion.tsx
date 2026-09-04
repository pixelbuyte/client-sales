"use client";

import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger, SplitText, MOTION_OK, DESKTOP } from "./gsapSetup";

/**
 * Page-wide scroll motion for the sections that are plain server components.
 * Everything is gsap.from() so the server-rendered page is complete without
 * JS, and everything sits inside a reduced-motion match so it simply shows
 * when the visitor asked for less motion.
 *
 *   data-split          h2: words pop in when the heading scrolls into view
 *   data-reveal         rise + fade on entry
 *   data-reveal-group   children rise + fade with a stagger
 *   data-hours          the 24 hour bars grow up from the baseline
 *   data-road / data-van  the van drives across the road as you scroll
 *   data-peel           the pricing card peels in with a 3D rotateX
 *   data-x              marker X marks scale in with a bounce
 */
export function PageMotion() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const splits: SplitText[] = [];

      {
        // Headline word pops (hero has its own).
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((h) => {
          const s = new SplitText(h, { type: "words" });
          splits.push(s);
          gsap.from(s.words, {
            yPercent: 60,
            opacity: 0,
            rotation: 3,
            scale: 0.94,
            transformOrigin: "0% 100%",
            duration: 0.6,
            stagger: 0.04,
            ease: "back.out(1.8)",
            scrollTrigger: { trigger: h, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 36,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
          const kids = Array.from(group.children);
          gsap.from(kids, {
            y: 40,
            opacity: 0,
            rotation: (i) => (i % 2 ? 1.2 : -1.2),
            transformOrigin: "50% 0%",
            duration: 0.9,
            stagger: 0.1,
            ease: "back.out(1.4)",
            scrollTrigger: { trigger: group, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-hours]").forEach((row) => {
          gsap.from(row.children, {
            scaleY: 0,
            transformOrigin: "50% 100%",
            duration: 0.7,
            stagger: 0.025,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 85%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-x]").forEach((x) => {
          gsap.from(x, {
            scale: 2.2,
            opacity: 0,
            rotation: "+=20",
            duration: 0.5,
            ease: "back.out(3)",
            scrollTrigger: { trigger: x, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-peel]").forEach((card) => {
          gsap.from(card, {
            rotationX: -42,
            y: 40,
            opacity: 0,
            transformOrigin: "50% 0%",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          });
        });

        // The van drives across the road, tied to scroll.
        gsap.utils.toArray<HTMLElement>("[data-road]").forEach((road) => {
          const van = road.querySelector<HTMLElement>("[data-van]");
          if (!van) return;
          gsap.fromTo(
            van,
            { x: 0 },
            {
              x: () => road.clientWidth - van.offsetWidth - road.clientWidth * 0.08,
              ease: "none",
              scrollTrigger: { trigger: road, start: "top 95%", end: "bottom 25%", scrub: 0.8, invalidateOnRefresh: true },
            },
          );
          // Wheels rock a touch so it reads as rolling.
          gsap.to(van, {
            y: -2,
            duration: 0.18,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            scrollTrigger: { trigger: road, start: "top 95%", end: "bottom 25%", toggleActions: "play pause resume pause" },
          });
        });

      }

      // Font swap can move things a few pixels; re-measure once fonts land.
      let alive = true;
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(() => {
          if (alive) ScrollTrigger.refresh();
        });
      }

      return () => {
        alive = false;
        splits.forEach((s) => s.revert());
      };
    });

    // A little parallax on the big board headings, desktop only.
    mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 30 },
          {
            y: -30,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return null;
}
