// Same ticket-stub mark as the marketing site (components/marketing/Logo.tsx),
// recolored via currentColor to sit on the admin app's own palette instead of
// the marketing one. Kept as a separate component since the two surfaces use
// different Tailwind token sets (accent vs. clay).
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={`h-7 w-7 shrink-0 text-accent ${className}`}
      aria-hidden
    >
      <path
        d="M4 8.5C4 6.567 5.567 5 7.5 5h17C26.433 5 28 6.567 28 8.5v3a2.5 2.5 0 0 0 0 5v3c0 1.933-1.567 3.5-3.5 3.5h-17A3.5 3.5 0 0 1 4 19.5v-3a2.5 2.5 0 0 0 0-5v-3Z"
        fill="currentColor"
      />
      <circle cx="16" cy="11.4" r="1.15" fill="white" />
      <path
        d="M12.4 16.6l2.5 2.5 4.7-5.3"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
