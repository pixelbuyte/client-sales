import Image from "next/image";
import { ArrowRight } from "lucide-react";

const DECODES = [
  {
    code: "APL AIRPODS PR",
    name: "AirPods Pro",
    merchant: "Apple",
    category: "Electronics",
    categoryColor: "#6366f1",
    image: "/products/airpods-pro.jpg",
  },
  {
    code: "NIKE AIR MAX",
    name: "Nike Air Max",
    merchant: "Nike",
    category: "Clothing",
    categoryColor: "#f59e0b",
    image: "/products/nike-air-max.jpg",
  },
  {
    code: "WFM ORG BLB",
    name: "Organic blueberries",
    merchant: "Whole Foods",
    category: "Groceries",
    categoryColor: "#22c55e",
    image: "/products/whole-foods.png",
  },
] as const;

export function ReceiptDecodeShowcase() {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
        <span>On receipt</span>
        <span className="opacity-0 sm:opacity-100">→</span>
        <span>In your dashboard</span>
      </div>

      {DECODES.map((row, i) => (
        <div
          key={row.code}
          className="decode-row group relative flex items-stretch gap-2 sm:gap-3"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          {/* Receipt strip */}
          <div className="flex min-w-0 flex-1 flex-col justify-center rounded-md border border-dashed border-border bg-sidebar/80 px-3 py-3 sm:px-4">
            <span className="font-mono text-[8px] uppercase tracking-widest text-muted/70">
              Line item
            </span>
            <span className="mt-1 truncate font-mono text-xs font-medium tracking-tight text-ink/70 line-through decoration-muted/40 sm:text-sm">
              {row.code}
            </span>
          </div>

          <div className="flex shrink-0 items-center text-accent/60 transition-colors group-hover:text-accent">
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
          </div>

          {/* Dashboard card */}
          <div className="flex min-w-0 flex-[1.35] items-center gap-2.5 rounded-md border border-border bg-surface px-2.5 py-2 shadow-card transition-shadow group-hover:shadow-card-hover sm:gap-3 sm:px-3 sm:py-2.5">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-border bg-bg sm:h-12 sm:w-12">
              <Image
                src={row.image}
                alt={row.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium leading-tight">
                {row.name}
              </div>
              <div className="mt-0.5 truncate font-mono text-[10px] text-muted">
                {row.merchant}
              </div>
              <span
                className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                style={{
                  backgroundColor: row.categoryColor + "18",
                  color: row.categoryColor,
                }}
              >
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ backgroundColor: row.categoryColor }}
                />
                {row.category}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MerchantSenseShowcase() {
  const types = [
    { merchant: "Whole Foods", tag: "Grocery", color: "#22c55e", image: "/products/whole-foods.png" },
    { merchant: "Apple", tag: "Retail", color: "#6366f1", image: "/products/airpods-pro.jpg" },
    { merchant: "Chipotle", tag: "Restaurant", color: "#D4451A", image: null },
  ] as const;

  return (
    <div className="mt-6 space-y-3">
      {types.map((t) => (
        <div
          key={t.merchant}
          className="flex items-center gap-3 rounded-md border border-border bg-bg/60 px-3 py-3 sm:px-4"
        >
          {t.image ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-surface">
              <Image src={t.image} alt="" fill sizes="40px" className="object-cover" />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-lg">
              🌯
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{t.merchant}</div>
            <div className="font-mono text-[10px] text-muted">detected automatically</div>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider"
            style={{ backgroundColor: t.color + "18", color: t.color }}
          >
            {t.tag}
          </span>
        </div>
      ))}
    </div>
  );
}
