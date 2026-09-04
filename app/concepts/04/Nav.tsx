"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { BUSINESS_NAME } from "@/lib/business";
import { gsap, ScrollTrigger, setNavTheme, type NavTheme } from "./gsapSetup";

// Fixed nav that flips between navy and paper depending on what's beneath
// it. Sections declare data-nav="dark|light"; pinned sections override
// from their own scrub via setNavTheme().
export function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = document.querySelectorAll<HTMLElement>(".c04 [data-nav]");
      sections.forEach((el) => {
        const theme = (el.dataset.nav as NavTheme) || "light";
        ScrollTrigger.create({
          trigger: el,
          start: "top 32px",
          end: "bottom 32px",
          onEnter: () => setNavTheme(theme),
          onEnterBack: () => setNavTheme(theme),
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header className="c04-nav" ref={ref} data-theme="dark">
      <div className="c04-wrap c04-nav-in">
        <Link href="/" className="c04-brand" aria-label={`${BUSINESS_NAME} home`}>
          <span className="c04-brand-mark" aria-hidden="true">
            <i />
            <i />
          </span>
          {BUSINESS_NAME}
        </Link>
        <nav className="c04-nav-links" aria-label="Page">
          <a href="#leaks" className="c04-nav-link">
            What leaks
          </a>
          <a href="#how" className="c04-nav-link">
            How it works
          </a>
          <a href="#pricing" className="c04-nav-link">
            Pricing
          </a>
          <Link href="/demo" className="c04-btn">
            Watch the demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
