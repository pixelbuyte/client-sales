export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent font-mono text-xs font-bold text-white ${className}`}
      aria-hidden
    >
      H
    </div>
  );
}
