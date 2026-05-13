import { cn } from "@/lib/cn";

export function DeadlineChip({ days }: { days: number | null }) {
  if (days === null) return null;
  if (days < 0) {
    return (
      <span className="rounded-full bg-bg px-2 py-0.5 font-mono text-[10px] text-muted line-through">
        expired
      </span>
    );
  }
  const tone =
    days <= 3
      ? "bg-accent-50 text-accent"
      : days <= 7
      ? "bg-warning-50 text-warning"
      : "bg-bg text-muted";
  return (
    <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px] font-medium", tone)}>
      {days === 0 ? "today" : `${days}d left`}
    </span>
  );
}
