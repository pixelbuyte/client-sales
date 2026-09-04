"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText, MQ, setNavTheme } from "./gsapSetup";
import { Scene, Check, Arrow } from "./Illustrations";
import { Ticket } from "./Ticket";

type Variant = "before" | "after";

// Both faces share identical geometry. The "covered" face sits on top in a
// window that slides; wherever the window has passed, the night is over.
function Face({ variant, primary }: { variant: Variant; primary: boolean }) {
  const before = variant === "before";
  const Heading = primary ? "h1" : "p";
  const tab = primary ? undefined : -1;

  return (
    <>
    <div className="c04-face">
      <div className="c04-face-top">
        <span className={`c04-chip ${before ? "c04-chip--missed" : "c04-chip--booked"}`}>
          <i aria-hidden="true" />
          {before ? "As it stands · Tuesday 9:14 pm" : "Covered · Wednesday 7:30 am"}
        </span>
        <span className="c04-chip c04-chip--quiet">Greater Boston · eastern MA</span>
      </div>

      <Heading className="c04-h1" data-hero-h1>
        <span className="c04-line">Your phone rang</span>
        <span className="c04-line">at 9:14 pm.</span>
      </Heading>

      <div className="c04-face-grid">
        <div className="c04-face-copy">
          <p className="c04-lede" data-hero-rise>
            {before
              ? "That was a no-heat call in Quincy. It rang out. Nine minutes later she was on the phone with the next shop in the search results."
              : "That was a no-heat call in Quincy. She had a text back in four seconds, picked the 7:30 am window, and it's on your board like any other job."}
          </p>
          <div className="c04-cta-row" data-hero-rise>
            <Link href="/demo" className="c04-btn" tabIndex={tab}>
              Watch the 5-min demo <Arrow />
            </Link>
            <span className="c04-then">then a 15-minute call</span>
          </div>
          <ul className="c04-checks" data-hero-rise>
            {["Nothing for techs to install", "Keep your number", "Monthly starts at go-live", "Cancel any time"].map(
              (t) => (
                <li key={t}>
                  <Check size={13} />
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="c04-face-scene" data-hero-scene>
          <Scene variant={variant} />
          <Ticket
            no="2211"
            time="9:14 pm"
            name="Dana R."
            town="Quincy"
            said="Furnace won't fire, house is down to 54."
            status={before ? "missed" : "booked"}
            stamp={before ? "Missed" : "Booked"}
            stampNote={before ? "no answer" : "7:30 am · Truck 2"}
          />
        </div>
      </div>
    </div>
    <Ticker variant={variant} />
    </>
  );
}

function Ticker({ variant }: { variant: Variant }) {
  const before = variant === "before";
  const item = before ? (
    <>
      9:14 pm · Quincy · no heat · <em className="c04-stamp-word">Missed</em>
    </>
  ) : (
    <>
      7:30 am · Quincy · no heat · <em className="c04-stamp-word">Booked</em>
    </>
  );
  return (
    <div className="c04-ticker" aria-hidden="true">
      <div className="c04-ticker-track">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// Scroll progress → split position. Beat one: the night takes the whole
// screen (nobody picked up). Beat two: covered wipes in from the right.
function splitFromProgress(p: number, start: number) {
  if (p < 0.28) return start + (100 - start) * gsap.parseEase("power1.inOut")(p / 0.28);
  if (p < 0.4) return 100;
  if (p > 0.88) return 0; // hold so scrub lag settles before the pin releases
  return 100 * (1 - gsap.parseEase("power2.inOut")((p - 0.4) / 0.48));
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const splitRef = useRef(62);
  const [covered, setCovered] = useState(false);

  // One place writes the split, so scroll, drag, keys and the toggle all
  // agree. Transforms only.
  const apply = useCallback((s: number) => {
    const v = gsap.utils.clamp(0, 100, s);
    splitRef.current = v;
    // x: 0 clears the CSS fallback transform so xPercent isn't added on top.
    if (wipeRef.current) gsap.set(wipeRef.current, { x: 0, xPercent: v });
    if (innerRef.current) gsap.set(innerRef.current, { x: 0, xPercent: -v });
    if (dividerRef.current) gsap.set(dividerRef.current, { x: 0, xPercent: v });
    if (handleRef.current) {
      const pct = String(Math.round(100 - v));
      handleRef.current.setAttribute("aria-valuenow", pct);
      handleRef.current.setAttribute("aria-valuetext", `${pct} percent covered`);
    }
    setNavTheme(v > 35 ? "dark" : "light");
    setCovered(v < 50);
  }, []);

  const tweenTo = useCallback(
    (target: number) => {
      const reduce = window.matchMedia(MQ.reduce).matches;
      const o = { s: splitRef.current };
      gsap.to(o, {
        s: target,
        duration: reduce ? 0 : 0.9,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate: () => apply(o.s),
      });
    },
    [apply],
  );

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];

    mm.add(
      { motion: MQ.motion, reduce: MQ.reduce, desktop: MQ.desktop, mobile: MQ.mobile },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as Record<string, boolean>;
        const start = desktop ? 62 : 100;
        apply(start);

        if (!motion) return;

        // Intro: identical reveal on both faces so the split stays clean.
        const heads = root.querySelectorAll<HTMLElement>("[data-hero-h1]");
        heads.forEach((h) => {
          const split = SplitText.create(h, { type: "lines", linesClass: "c04-split-line", mask: "lines" });
          splits.push(split);
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.09,
            delay: 0.15,
          });
        });
        root.querySelectorAll<HTMLElement>(".c04-face").forEach((face) => {
          gsap.from(face.querySelectorAll("[data-hero-rise]"), {
            y: 28,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.45,
          });
          gsap.from(face.querySelector("[data-hero-scene]"), {
            y: 40,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.35,
          });
        });

        if (desktop) {
          // Pinned wipe: the night takes over, then covered takes it back.
          ScrollTrigger.create({
            trigger: root,
            // If a short viewport makes the hero taller than the screen, pin
            // once its bottom edge arrives so nothing is hidden while pinned.
            start: () => (root.offsetHeight > window.innerHeight + 2 ? "bottom bottom" : "top top"),
            end: "+=150%",
            pin: true,
            scrub: 0.35,
            anticipatePin: 1,
            onUpdate: (self) => apply(splitFromProgress(self.progress, start)),
          });
        }
      },
    );

    const onFonts = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(onFonts);

    return () => {
      splits.forEach((s) => s.revert());
      mm.revert();
    };
  }, [apply]);

  // Pointer drag on the handle.
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = stage.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      apply(pct);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 20 : 5;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      apply(splitRef.current - step);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      apply(splitRef.current + step);
    } else if (e.key === "Home") {
      e.preventDefault();
      tweenTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      tweenTo(100);
    }
  };

  return (
    <section className="c04-hero" ref={rootRef} data-nav="dark" aria-label="Before and after">
      <div className="c04-stage" ref={stageRef}>
        <div className="c04-layer c04-layer--before">
          <Face variant="before" primary />
        </div>

        <div className="c04-wipe" ref={wipeRef} aria-hidden="true">
          <div className="c04-wipe-inner" ref={innerRef}>
            <div className="c04-layer c04-layer--after">
              <Face variant="after" primary={false} />
            </div>
          </div>
        </div>

        <div className="c04-divider" ref={dividerRef}>
          <div className="c04-divider-line" aria-hidden="true" />
          <button
            type="button"
            className="c04-handle"
            role="slider"
            aria-label="How much of the night is covered"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={38}
            aria-valuetext="38 percent covered"
            ref={handleRef}
            onPointerDown={onPointerDown}
            onKeyDown={onKey}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" />
            </svg>
          </button>
        </div>

        <div className="c04-hero-ui">
          <span className="c04-scrollhint" aria-hidden="true">
            Scroll to cover the night
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v11M3.5 8.5L8 13l4.5-4.5" />
            </svg>
          </span>
          <button
            type="button"
            className="c04-toggle"
            aria-pressed={covered}
            onClick={() => tweenTo(covered ? 100 : 0)}
          >
            <span className="c04-toggle-track" aria-hidden="true" />
            {covered ? "Covered — show as it stands" : "Show it covered"}
          </button>
        </div>
      </div>
    </section>
  );
}
