"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, SplitText, MOTION_OK } from "./gsapSetup";
import { NightHouse, Tick } from "./Illustrations";
import { MagneticLink } from "./MagneticLink";

const CHECKS = [
  "Your number stays yours",
  "Nothing for techs to install",
  "Monthly starts at go-live",
  "Cancel any time",
];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
          const h1 = root.querySelector<HTMLElement>(".c02-h1");
          if (!h1) return;

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(".c02-hero-eyebrow .c02-rule", { scaleX: 0, duration: 0.8 }, 0.05)
            .from(".c02-hero-eyebrow span:last-child", { opacity: 0, x: -8, duration: 0.6 }, 0.15);

          SplitText.create(h1, {
            type: "lines",
            mask: "lines",
            linesClass: "line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.15,
                ease: "power4.out",
                stagger: 0.11,
                delay: 0.2,
              }),
          });

          tl.from(".c02-hero-lede", { y: 22, opacity: 0, duration: 0.9 }, 0.75)
            .from(".c02-hero-cta > *", { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.9)
            .from(".c02-checks li", { y: 12, opacity: 0, duration: 0.6, stagger: 0.06 }, 1.05)
            .from(
              ".c02-plate",
              { clipPath: "inset(100% 0% 0% 0%)", duration: 1.5, ease: "power3.inOut" },
              0.35,
            )
            .from(".c02-plate-caption", { opacity: 0, duration: 0.6 }, 1.3)
            .from(".c02-hero-ticket", { y: 30, opacity: 0, duration: 0.9 }, 1.1)
            .add(() => {
              root.querySelector(".c02-hero-ticket .c02-ticket")?.classList.add("is-booked");
            }, 1.6)
            .from(
              ".c02-hero-ticket .c02-stamp",
              { scale: 2.2, opacity: 0, rotate: -2, duration: 0.55, ease: "back.out(2.2)" },
              1.6,
            );

          // Parallax: the plate drifts slower than the page.
          gsap.to(".c02-hero-art", {
            yPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        });
      }, root);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="c02-hero" aria-labelledby="c02-hero-title">
      <div className="c02-wrap">
        <div className="c02-hero-grid">
          <div className="c02-hero-copy">
            <p className="c02-eyebrow c02-hero-eyebrow">
              <span className="c02-rule" aria-hidden="true" />
              <span>Greater Boston · Eastern Mass. · HVAC shops, 5 to 30 trucks</span>
            </p>

            <h1 id="c02-hero-title" className="c02-h1">
              Your phone rang at 9:14 pm. <em>Nobody picked up.</em>
            </h1>

            <p className="c02-hero-lede">
              That was a no-heat call in Quincy. She got voicemail, hung up, and dialed the next
              shop on the list. We put those calls — and the estimates that went quiet — back on
              your board as booked jobs.
            </p>

            <div className="c02-hero-cta">
              <MagneticLink href="/demo" className="c02-btn">
                Watch the 5-min demo
                <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </MagneticLink>
              <span className="c02-hero-cta-note">then a 15-minute call. No forms, no signup.</span>
            </div>

            <ul className="c02-checks">
              {CHECKS.map((c) => (
                <li key={c}>
                  <Tick />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="c02-hero-art">
            <div className="c02-plate">
              <NightHouse />
              <span className="c02-plate-caption">Tuesday · Quincy</span>
            </div>

            <article className="c02-hero-ticket">
              <div className="c02-ticket">
                <span className="c02-ticket-edge" aria-hidden="true" />
                <div className="c02-ticket-meta">
                  <span>#2211</span>
                  <span>9:14 pm</span>
                </div>
                <div className="c02-ticket-name">
                  Dana R. <span>· Quincy</span>
                </div>
                <p className="c02-ticket-said">&ldquo;Furnace won&apos;t fire, house is down to 54.&rdquo;</p>
                <div className="c02-ticket-foot">
                  <span>Text back 9:14 pm</span>
                  <span>Picked the 7–9 am window</span>
                  <span>
                    <b>On the board</b>
                  </span>
                </div>
                <div className="c02-stamp" aria-label="Booked, 7:30 am">
                  Booked
                  <small>7:30 am</small>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
