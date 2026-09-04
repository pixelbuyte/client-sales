"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, MQ } from "./gsapSetup";

// One client module wires every scroll reveal on the page from data
// attributes, so the sections themselves stay server-rendered and fully
// visible if JS never runs. Everything is gsap.from(): the resting state is
// the HTML as shipped.
//
//   data-split          headline, revealed line by line through a mask
//   data-reveal         rise + fade in
//   data-reveal-group   children rise in, staggered
//   data-count          count a number up from 0 (data-prefix / data-suffix)
//   data-line           scale a rail from 0 to 1 as you scroll past
//   data-bars           children grow from the bottom, staggered
//   data-rail           scale a horizontal rail in on enter
export function PageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".c04");
    if (!root) return;

    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];

    mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions as Record<string, boolean>;
      if (!motion) return;

      const scoped = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel)).filter(
        (el) => !el.closest(".c04-hero"),
      );

      scoped("[data-split]").forEach((el) => {
        const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "c04-split-line" });
        splits.push(split);
        gsap.from(split.lines, {
          yPercent: 105,
          duration: 1,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      scoped("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      scoped("[data-reveal-group]").forEach((el) => {
        gsap.from(Array.from(el.children), {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      scoped("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count || "0");
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        const render = () => {
          el.textContent = `${prefix}${Math.round(obj.v).toLocaleString("en-US")}${suffix}`;
        };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: render,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      scoped("[data-line]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: "top 70%",
              end: "bottom 70%",
              scrub: desktop ? 0.4 : true,
            },
          },
        );
      });

      scoped("[data-bars]").forEach((el) => {
        gsap.from(Array.from(el.children), {
          scaleY: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: { each: 0.025, from: "start" },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      scoped("[data-rail]").forEach((el) => {
        const vertical = window.matchMedia("(max-width: 640px)").matches;
        gsap.from(el, {
          [vertical ? "scaleY" : "scaleX"]: 0,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);

    return () => {
      splits.forEach((s) => s.revert());
      mm.revert();
    };
  }, []);

  return null;
}
