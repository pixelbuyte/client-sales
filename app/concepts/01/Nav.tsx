"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BUSINESS_NAME } from "@/lib/business";

// A small clock in the nav showing the visitor's own local time and whether
// a shop office would be open right now. Rendered blank on the server and
// filled in after mount, so there is nothing to mismatch on hydration.
function useLocalClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function formatTime(d: Date) {
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export function Nav() {
  const now = useLocalClock();
  const hour = now?.getHours() ?? 12;
  const weekday = now ? now.getDay() >= 1 && now.getDay() <= 5 : true;
  const officeOpen = weekday && hour >= 7 && hour < 17;

  return (
    <header className="c1-nav">
      <div className="c1-nav-inner">
        <Link href="/concepts/01" className="c1-brand" aria-label={`${BUSINESS_NAME} home`}>
          <span className="c1-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14 L12 6 L20 14" />
              <path d="M7 12 V20 H17 V12" />
              <rect x="10.5" y="15" width="3" height="3" />
            </svg>
          </span>
          <span className="c1-brand-name">{BUSINESS_NAME}</span>
        </Link>

        <div className="c1-clock" aria-live="off" title="Your local time">
          <span className={`c1-clock-dot ${officeOpen ? "is-open" : "is-closed"}`} aria-hidden="true" />
          <span className="c1-clock-time">{now ? formatTime(now) : "  :  "}</span>
          <span className="c1-clock-label">
            {now ? (officeOpen ? "office hours" : "after hours") : "your time"}
          </span>
        </div>

        <nav className="c1-nav-links" aria-label="Page">
          <a href="#how" className="c1-nav-link">
            How it works
          </a>
          <a href="#pricing" className="c1-nav-link">
            Pricing
          </a>
          <Link href="/demo" className="c1-btn c1-btn--sm">
            Watch the 5-min demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
