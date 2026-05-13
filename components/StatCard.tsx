import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  sub,
  children,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card p-5", className)}>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </div>
      <div className="mt-2 font-mono text-3xl font-medium tracking-tight">
        {value}
      </div>
      {sub ? (
        <div className="mt-1 font-mono text-[10px] text-muted">{sub}</div>
      ) : null}
      {children ? <div className="mt-4 space-y-2">{children}</div> : null}
    </div>
  );
}
