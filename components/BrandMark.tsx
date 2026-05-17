import Image from "next/image";

const BOX = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-12 w-12 rounded-xl",
} as const;

export type BrandId = "apple" | "nike" | "whole-foods" | "chipotle";

export function brandFromPath(path: string | null | undefined): BrandId | null {
  if (!path) return null;
  if (path.includes("whole-foods")) return "whole-foods";
  if (path.includes("airpods") || path.includes("apple")) return "apple";
  if (path.includes("nike")) return "nike";
  if (path.includes("chipotle")) return "chipotle";
  return null;
}

export function brandFromMerchant(merchant: string | null | undefined): BrandId | null {
  const m = merchant?.trim().toLowerCase() ?? "";
  if (m.includes("whole foods")) return "whole-foods";
  if (m === "apple" || m.includes("apple")) return "apple";
  if (m.includes("nike")) return "nike";
  if (m.includes("chipotle")) return "chipotle";
  return null;
}

export function BrandMark({
  brand,
  size = "md",
  className = "",
}: {
  brand: BrandId;
  size?: keyof typeof BOX;
  className?: string;
}) {
  const box = `${BOX[size]} ${className}`;

  if (brand === "whole-foods") {
    return (
      <div
        className={`relative shrink-0 overflow-hidden border border-border/60 bg-white shadow-[0_1px_3px_rgba(24,18,10,0.08)] ${box}`}
      >
        <Image
          src="/products/whole-foods.png"
          alt="Whole Foods Market"
          fill
          sizes="48px"
          className="object-contain p-0.5"
        />
      </div>
    );
  }

  if (brand === "apple") {
    return (
      <div
        className={`relative shrink-0 overflow-hidden border border-border/50 bg-[#f5f5f7] shadow-[0_1px_3px_rgba(24,18,10,0.08)] ${box}`}
        aria-label="Apple"
      >
        <Image
          src="/brands/apple.svg"
          alt=""
          fill
          sizes="48px"
          className="object-contain p-2"
        />
      </div>
    );
  }

  if (brand === "nike") {
    return (
      <div
        className={`relative shrink-0 overflow-hidden border border-neutral-800 bg-neutral-950 shadow-[0_1px_3px_rgba(24,18,10,0.12)] ${box}`}
        aria-label="Nike"
      >
        <Image
          src="/brands/nike.svg"
          alt=""
          fill
          sizes="48px"
          className="object-contain p-2 brightness-0 invert"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-[#6d1a14]/40 bg-[#a81612] px-1 shadow-[0_1px_3px_rgba(24,18,10,0.08)] ${box}`}
      aria-label="Chipotle Mexican Grill"
    >
      <span
        className={`text-center font-bold uppercase leading-[1.05] tracking-[0.08em] text-white ${
          size === "sm"
            ? "text-[5.5px]"
            : size === "md"
              ? "text-[6.5px]"
              : "text-[7.5px]"
        }`}
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        Chipotle
      </span>
    </div>
  );
}
