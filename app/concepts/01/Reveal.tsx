"use client";

import { useLayoutEffect, useRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { gsap, SplitText, motionAllowed } from "./motion";

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
};

// Wraps a section. Headlines marked data-split get a masked line reveal;
// anything marked data-rise floats up in a stagger. Both use gsap.from, so
// the server-rendered markup is complete and visible if JS never runs.
export function Reveal({ as: Tag = "section", children, ...rest }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !motionAllowed()) return;

    let dead = false;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const rises = root.querySelectorAll<HTMLElement>("[data-rise]");
      if (rises.length) {
        gsap.from(rises, {
          y: 28,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        });
      }
    }, root);

    // Split only after the display face has loaded, or the line breaks
    // are measured against the fallback font.
    document.fonts.ready.then(() => {
      if (dead) return;
      ctx.add(() => {
        root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
          const split = new SplitText(el, {
            type: "lines",
            mask: "lines",
            linesClass: "c1-line",
          });
          splits.push(split);
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 1.0,
            ease: "power4.out",
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
    });

    return () => {
      dead = true;
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
