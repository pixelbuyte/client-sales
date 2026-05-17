import Image from "next/image";
import { ShoppingBag } from "lucide-react";

export function ProductThumb({
  imageUrl,
  name,
  color,
  size = "md",
}: {
  imageUrl: string | null;
  name: string;
  color?: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  if (imageUrl) {
    return (
      <div className={`relative ${dim} shrink-0 overflow-hidden rounded-md border border-border bg-surface`}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes={size === "sm" ? "32px" : "40px"}
          className="object-contain p-1.5"
        />
      </div>
    );
  }

  const bg = (color ?? "#8B7355") + "20";
  const fg = color ?? "#8B7355";
  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center rounded-md border border-border`}
      style={{ backgroundColor: bg, color: fg }}
    >
      <ShoppingBag className={icon} />
    </div>
  );
}
