import { BUSINESS_NAME } from "@/lib/business";

// Mark echoes the job-ticket motif used throughout the site: a torn stub
// with a punched hole, stamped with a check — "handled," not "answered by
// a machine." Inline SVG so it's crisp at any size with no asset to host.
//
// Colors come from the ocean palette (design/COLOR-RESEARCH.md): the stub is
// navy on daytime sections; pass `tone="light"` to render it white on a
// night band.
export function LogoMark({
  className = "h-8 w-8",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const stub = tone === "light" ? "text-white" : "text-ocean";
  const punch = tone === "light" ? "text-ocean-deep" : "text-sea-bg";
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M4 8.5C4 6.567 5.567 5 7.5 5h17C26.433 5 28 6.567 28 8.5v3a2.5 2.5 0 0 0 0 5v3c0 1.933-1.567 3.5-3.5 3.5h-17A3.5 3.5 0 0 1 4 19.5v-3a2.5 2.5 0 0 0 0-5v-3Z"
        fill="currentColor"
        className={stub}
      />
      <circle cx="16" cy="11.4" r="1.15" fill="currentColor" className={punch} />
      <path
        d="M12.4 16.6l2.5 2.5 4.7-5.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={punch}
      />
    </svg>
  );
}

// Reads the same BUSINESS_NAME the pay pages and Stripe products use, so a
// NEXT_PUBLIC_BUSINESS_NAME override changes the wordmark too.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif text-[1.2rem] leading-none tracking-tight ${className}`}>
      {BUSINESS_NAME}
    </span>
  );
}
