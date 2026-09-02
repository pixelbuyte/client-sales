// Mark echoes the job-ticket motif used throughout the site: a torn stub
// with a punched hole, stamped with a check — "handled," not "answered by
// a machine." Kept as inline SVG so it's crisp at any size with no asset
// to host.
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M4 8.5C4 6.567 5.567 5 7.5 5h17C26.433 5 28 6.567 28 8.5v3a2.5 2.5 0 0 0 0 5v3c0 1.933-1.567 3.5-3.5 3.5h-17A3.5 3.5 0 0 1 4 19.5v-3a2.5 2.5 0 0 0 0-5v-3Z"
        fill="currentColor"
        className="text-clay"
      />
      <circle cx="16" cy="11.4" r="1.15" fill="currentColor" className="text-sand-surface" />
      <path
        d="M12.4 16.6l2.5 2.5 4.7-5.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-sand-surface"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif text-[1.2rem] leading-none tracking-tight ${className}`}>
      Afterline
    </span>
  );
}
