"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, CINEMATIC, MOTION_OK } from "./motion";
import { DeskPhone } from "./Illustrations";

const RING_C = 2 * Math.PI * 24; // progress ring circumference

function fmtClock(minutes: number) {
  const total = ((Math.round(minutes) % 1440) + 1440) % 1440;
  let h = Math.floor(total / 60);
  const m = total % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return { time: `${h}:${m.toString().padStart(2, "0")}`, ampm };
}

// The 9:14 pm story. On desktop with motion allowed, the section pins and
// four beats play on the scroll: the phone rings up to 9:14, nobody picks
// up, recovery flips on and a text goes back in four seconds, the job is
// stamped BOOKED. Everywhere else the final beat is simply shown.
//
// The server-rendered markup IS the final beat. The timeline uses fromTo
// to set earlier states, so without JS the page still tells the ending.
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"static" | "cinematic">("static");

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ---------------------------------------------------- cinematic ---
      mm.add(CINEMATIC, () => {
        setMode("cinematic");

        const q = gsap.utils.selector(el);
        const clockTime = q(".c1-readout-time")[0];
        const clockAmpm = q(".c1-readout-ampm")[0];
        const clock = { m: 20 * 60 + 52 };
        const writeClock = () => {
          const { time, ampm } = fmtClock(clock.m);
          if (clockTime) clockTime.textContent = time;
          if (clockAmpm) clockAmpm.textContent = ampm;
        };
        const sec = { v: 0 };
        const secEl = q(".c1-pr-text")[0];
        const writeSec = () => {
          if (secEl) secEl.textContent = `${sec.v.toFixed(1)}s`;
        };

        // Load-in for the copy column — plays once, not tied to scroll.
        gsap.from(q(".c1-li"), {
          yPercent: 110,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          delay: 0.1,
        });
        gsap.from(q(".c1-hero-copy [data-hero-rise]"), {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.45,
        });
        gsap.from(q(".c1-stagewrap"), {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.25,
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
          },
        });

        /* ---- beat 1 · 0–2.5 · the phone rings, the clock climbs to 9:14 */
        tl.set(clock, { m: 20 * 60 + 52, onUpdate: writeClock }, 0);
        tl.to(clock, { m: 21 * 60 + 14, duration: 2.0, onUpdate: writeClock, ease: "power1.inOut" }, 0);
        tl.fromTo(
          q(".c1-desk"),
          { xPercent: 40, yPercent: 22, scale: 1.45 },
          { xPercent: 40, yPercent: 22, scale: 1.45, duration: 0.01 },
          0,
        );
        q(".c1-ring").forEach((ring, i) => {
          tl.fromTo(
            ring,
            { scale: 0.55, opacity: 0.9, transformOrigin: "150px 64px" },
            {
              scale: 1.9,
              opacity: 0,
              duration: 0.75,
              repeat: 2,
              ease: "power1.out",
              transformOrigin: "150px 64px",
            },
            0.15 + i * 0.25,
          );
        });
        tl.fromTo(
          q(".c1-handset"),
          { rotation: -1.5, transformOrigin: "50% 100%" },
          { rotation: 1.5, duration: 0.09, yoyo: true, repeat: 23, ease: "sine.inOut" },
          0.2,
        );
        tl.fromTo(q(".c1-cap-1"), { autoAlpha: 1 }, { autoAlpha: 1, duration: 1.8 }, 0);
        tl.to(q(".c1-cap-1"), { autoAlpha: 0, y: -10, duration: 0.3 }, 2.1);
        tl.to(q(".c1-scrollcue"), { autoAlpha: 0, duration: 0.4 }, 0.1);
        tl.fromTo(q(".c1-switch-knob"), { x: 0 }, { x: 0, duration: 0.01 }, 0);
        tl.fromTo(
          q(".c1-switch-track"),
          { backgroundColor: "rgba(255,255,255,0.16)" },
          { backgroundColor: "rgba(255,255,255,0.16)", duration: 0.01 },
          0,
        );
        tl.fromTo(q(".c1-switch-on"), { autoAlpha: 0 }, { autoAlpha: 0, duration: 0.01 }, 0);
        tl.fromTo(q(".c1-switch-off"), { autoAlpha: 1 }, { autoAlpha: 1, duration: 0.01 }, 0);

        /* ---- beat 2 · 2.5–4.6 · nobody picked up */
        tl.to(q(".c1-rings"), { opacity: 0, duration: 0.3 }, 2.4);
        tl.to(q(".c1-desk"), { opacity: 0.35, duration: 0.6 }, 2.5);
        tl.to(q(".c1-led"), { attr: { fill: "#C0392B" }, duration: 0.2 }, 2.5);
        tl.fromTo(
          q(".c1-nobody-line"),
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          2.6,
        );
        tl.fromTo(
          q(".c1-nobody-sub"),
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          3.2,
        );
        tl.to(clock, { m: 21 * 60 + 23, duration: 1.4, onUpdate: writeClock }, 2.8);
        tl.fromTo(q(".c1-cap-2"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 2.7);
        tl.to(q(".c1-cap-2"), { autoAlpha: 0, y: -10, duration: 0.3 }, 4.4);

        /* ---- beat 3 · 4.6–7.6 · recovery on, the text goes back */
        tl.to(q(".c1-nobody-line, .c1-nobody-sub"), { autoAlpha: 0, y: -18, duration: 0.45, stagger: 0.05 }, 4.6);
        tl.to(clock, { m: 21 * 60 + 14, duration: 0.5, onUpdate: writeClock }, 4.7);
        tl.to(q(".c1-led"), { attr: { fill: "#9DB4C4" }, duration: 0.2 }, 4.8);
        tl.to(q(".c1-switch-knob"), { x: 26, duration: 0.35, ease: "power2.inOut" }, 4.9);
        tl.to(q(".c1-switch-track"), { backgroundColor: "#1F8A5B", duration: 0.35 }, 4.9);
        tl.to(q(".c1-switch-off"), { autoAlpha: 0, duration: 0.2 }, 4.9);
        tl.to(q(".c1-switch-on"), { autoAlpha: 1, duration: 0.2 }, 5.1);
        tl.to(q(".c1-desk"), { xPercent: 0, yPercent: 0, scale: 1, opacity: 0.55, duration: 0.8, ease: "power2.inOut" }, 5.0);
        tl.fromTo(q(".c1-cap-3"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 5.0);
        tl.fromTo(
          q(".c1-mobile"),
          { autoAlpha: 0, y: 90, rotate: 3 },
          { autoAlpha: 1, y: 0, rotate: 0, duration: 0.9, ease: "power3.out" },
          5.2,
        );
        tl.fromTo(q(".c1-pr-ring"), { strokeDashoffset: RING_C }, { strokeDashoffset: 0, duration: 0.8 }, 5.6);
        tl.set(sec, { v: 0, onUpdate: writeSec }, 5.6);
        tl.to(sec, { v: 4, duration: 0.8, onUpdate: writeSec }, 5.6);
        tl.fromTo(
          q(".c1-pr"),
          { autoAlpha: 0, scale: 0.8 },
          { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" },
          5.6,
        );
        q(".c1-bubble").forEach((b, i) => {
          tl.fromTo(
            b,
            { autoAlpha: 0, y: 14, scale: 0.96, transformOrigin: i % 2 ? "100% 100%" : "0% 100%" },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" },
            6.3 + i * 0.5,
          );
        });
        tl.to(q(".c1-cap-3"), { autoAlpha: 0, y: -10, duration: 0.3 }, 7.9);

        /* ---- beat 4 · 8.0–10.2 · the ticket, stamped */
        tl.to(
          q(".c1-mobile"),
          { y: -34, scale: 0.88, transformOrigin: "100% 0%", duration: 0.8, ease: "power2.inOut" },
          8.0,
        );
        tl.to(q(".c1-desk"), { opacity: 0.3, duration: 0.6 }, 8.0);
        tl.fromTo(
          q(".c1-ticket"),
          { autoAlpha: 0, x: 140, y: 50, rotate: 5 },
          { autoAlpha: 1, x: 0, y: 0, rotate: 0, duration: 0.9, ease: "power3.out" },
          8.1,
        );
        tl.fromTo(
          q(".c1-ticket .c1-stamp"),
          { autoAlpha: 0, scale: 2.6, rotate: -24 },
          { autoAlpha: 1, scale: 1, rotate: -8, duration: 0.9, ease: "elastic.out(1, 0.5)" },
          9.0,
        );
        tl.fromTo(q(".c1-cap-4"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 8.4);
        tl.to(q(".c1-l3a"), { yPercent: -110, duration: 0.5, ease: "power2.inOut" }, 9.0);
        tl.fromTo(
          q(".c1-l3b"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.5, ease: "power2.inOut" },
          9.05,
        );
        tl.to(clock, { m: 21 * 60 + 15, duration: 0.6, onUpdate: writeClock }, 9.2);
        tl.to({}, { duration: 0.8 }); // let the ending sit before unpinning

        // Beat rail: a fill bar and the active label.
        const total = tl.duration();
        tl.fromTo(q(".c1-beat-fill"), { scaleX: 0 }, { scaleX: 1, duration: total, ease: "none" }, 0);
        const beats = q(".c1-beat");
        const starts = [0, 2.5, 4.6, 8.0];
        beats.forEach((b, i) => {
          tl.fromTo(b, { opacity: 0.4 }, { opacity: 1, duration: 0.3 }, starts[i]);
          if (i > 0) tl.to(beats[i - 1], { opacity: 0.55, duration: 0.3 }, starts[i]);
        });

        // Scroll cue bounce, until the story starts.
        gsap.to(q(".c1-scrollcue svg"), {
          y: 5,
          duration: 0.9,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });

        return () => setMode("static");
      });

      // ------------------------------------- static, but motion allowed ---
      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
        const q = gsap.utils.selector(el);
        gsap.from(q(".c1-li"), {
          yPercent: 110,
          duration: 1.0,
          ease: "power4.out",
          stagger: 0.1,
          delay: 0.1,
        });
        gsap.from(q(".c1-hero-copy [data-hero-rise], .c1-stagewrap"), {
          y: 22,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.4,
        });
        const stamp = q(".c1-ticket .c1-stamp");
        if (stamp.length) {
          gsap.from(stamp, {
            autoAlpha: 0,
            scale: 2.2,
            rotate: -24,
            duration: 0.9,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: { trigger: stamp[0], start: "top 90%", once: true },
          });
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="c1-hero c1-night" data-mode={mode} aria-labelledby="c1-h1">
      <div className="c1-hero-inner">
        {/* ------------------------------------------------------ copy */}
        <div className="c1-hero-copy">
          <p className="c1-eyebrow c1-eyebrow--pill" data-hero-rise>
            <span className="c1-dot" aria-hidden="true" />
            Greater Boston · eastern MA · HVAC shops, 5 to 30 trucks
          </p>

          <h1 id="c1-h1" className="c1-h1">
            <span className="c1-l">
              <span className="c1-li">Your phone rang</span>
            </span>
            <span className="c1-l">
              <span className="c1-li">at 9:14 pm.</span>
            </span>
            <span className="c1-l c1-l3">
              <span className="c1-li c1-l3a">
                <em>Nobody picked up.</em>
              </span>
              <span className="c1-l3b" aria-hidden="true">
                <em>Booked for 7:30 am.</em>
              </span>
            </span>
          </h1>

          <p className="c1-hero-lede" data-hero-rise>
            That was a no-heat call in Quincy. Without a text back, it goes to the next shop in
            the search results nine minutes later. We put those calls — and the estimates that
            went quiet — back on your schedule.
          </p>

          <div className="c1-cta-row" data-hero-rise>
            <Link href="/demo" className="c1-btn c1-btn--lg">
              Watch the 5-min demo
            </Link>
            <span className="c1-cta-after">then a 15-minute call</span>
          </div>

          <ul className="c1-checks" data-hero-rise>
            {[
              "Nothing for your techs to install",
              "You keep your number",
              "Monthly starts at go-live",
              "Cancel any time",
            ].map((t) => (
              <li key={t}>
                <Tick />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* ----------------------------------------------------- stage */}
        <div className="c1-stagewrap" aria-label="The same night, with and without a text back">
          <div className="c1-stage-head">
            <div className="c1-readout" aria-hidden="true">
              <span className="c1-readout-day">TUE</span>
              <span className="c1-readout-time">9:14</span>
              <span className="c1-readout-ampm">PM</span>
            </div>
            <div className="c1-switch" aria-hidden="true">
              <span className="c1-switch-label">Recovery</span>
              <span className="c1-switch-track">
                <span className="c1-switch-knob" />
              </span>
              <span className="c1-switch-text">
                <span className="c1-switch-off">off</span>
                <span className="c1-switch-on">on</span>
              </span>
            </div>
          </div>

          <div className="c1-stage">
            <div className="c1-desk">
              <DeskPhone className="c1-desk-svg" />
            </div>

            <div className="c1-nobody c1-beat-only" aria-hidden="true">
              <div className="c1-nobody-line">Nobody picked up.</div>
              <div className="c1-nobody-sub">
                It went to the next shop in the search results nine minutes later.
              </div>
            </div>

            {/* The customer's phone. A text from the shop's own number — not a chat window. */}
            <div className="c1-mobile">
              <div className="c1-mobile-frame">
                <div className="c1-mobile-status" aria-hidden="true">
                  <span className="c1-mono">9:14</span>
                  <span className="c1-mobile-notch" />
                  <span className="c1-mobile-batt" />
                </div>
                <div className="c1-thread-head">
                  <span className="c1-thread-avatar" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 14 L12 6 L20 14" />
                      <path d="M7 12 V20 H17 V12" />
                    </svg>
                  </span>
                  <div>
                    <div className="c1-thread-name">Your shop&apos;s number</div>
                    <div className="c1-thread-sub">Text message</div>
                  </div>
                  <div className="c1-pr" aria-label="Text back sent in 4 seconds">
                    <svg viewBox="0 0 56 56" width="44" height="44" aria-hidden="true">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#D3DFE8" strokeWidth="3" />
                      <circle
                        className="c1-pr-ring"
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="#1F8A5B"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={RING_C}
                        strokeDashoffset={0}
                        transform="rotate(-90 28 28)"
                      />
                    </svg>
                    <span className="c1-pr-text c1-mono">4.0s</span>
                  </div>
                </div>
                <div className="c1-thread">
                  <div className="c1-bubble c1-bubble--in">
                    <p>
                      Sorry we missed your call — this is the shop&apos;s line. No heat? Reply{" "}
                      <b>1</b> and we flag it tonight. Or pick a callback: <b>7–9 am</b> or{" "}
                      <b>9–11 am</b>.
                    </p>
                    <time className="c1-mono">9:14:04 pm</time>
                  </div>
                  <div className="c1-bubble c1-bubble--out">
                    <p>1. Furnace won&apos;t fire, house is down to 54.</p>
                    <time className="c1-mono">9:15:31 pm</time>
                  </div>
                  <div className="c1-bubble c1-bubble--in">
                    <p>
                      Got it, Dana — flagged no-heat. The on-call tech calls you in a few minutes.
                      First stop tomorrow, <b>7:30 am</b>.
                    </p>
                    <time className="c1-mono">9:15:36 pm</time>
                  </div>
                </div>
              </div>
            </div>

            {/* The job ticket, back on the book. */}
            <article className="c1-ticket">
              <span className="c1-ticket-edge" aria-hidden="true" />
              <div className="c1-ticket-meta">
                <span className="c1-mono">#2211</span>
                <span className="c1-mono">9:14 pm</span>
                <span className="c1-ticket-src">after hours</span>
              </div>
              <div className="c1-ticket-who">
                Dana R. <span>· Quincy</span>
              </div>
              <p className="c1-ticket-said">&ldquo;Furnace won&apos;t fire, house is down to 54.&rdquo;</p>
              <div className="c1-stamp c1-stamp--booked">
                <b>Booked</b>
                <span>7:30 am</span>
              </div>
            </article>
          </div>

          <div className="c1-captions c1-beat-only" aria-hidden="true">
            <span className="c1-cap c1-cap-1">Incoming · Tuesday, 9:14 pm · your main line</span>
            <span className="c1-cap c1-cap-2">Missed · no voicemail · nine minutes to the next shop</span>
            <span className="c1-cap c1-cap-3">Same call · a text from your number, in four seconds</span>
            <span className="c1-cap c1-cap-4">Back on the book · first stop tomorrow</span>
          </div>

          <div className="c1-beats c1-beat-only" aria-hidden="true">
            <div className="c1-beat-track">
              <span className="c1-beat-fill" />
            </div>
            <div className="c1-beat-labels">
              <span className="c1-beat">9:14 pm</span>
              <span className="c1-beat">Missed</span>
              <span className="c1-beat">Recovery on</span>
              <span className="c1-beat">Booked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="c1-scrollcue c1-beat-only" aria-hidden="true">
        <span>Scroll — watch the night play out</span>
        <ChevronDown size={18} strokeWidth={2} />
      </div>
    </section>
  );
}

function Tick() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="c1-tick"
    >
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}
