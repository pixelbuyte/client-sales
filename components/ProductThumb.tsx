import { ShoppingBag } from "lucide-react";
import { BrandMark, brandFromMerchant, brandFromPath } from "@/components/BrandMark";
import { MerchantLogo } from "@/components/MerchantLogo";

export function ProductThumb({
  imageUrl,
  name,
  color,
  merchant,
  size = "md",
}: {
  imageUrl: string | null;
  name: string;
  color?: string;
  merchant?: string | null;
  size?: "sm" | "md";
}) {
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const brand =
    brandFromMerchant(merchant) ??
    brandFromPath(imageUrl) ??
    brandFromMerchant(name);

  if (brand) {
    return <BrandMark brand={brand} size={size} />;
  }

  if (imageUrl) {
    return (
      <MerchantLogo src={imageUrl} alt={name} merchant={merchant} size={size} />
    );
  }

  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const bg = (color ?? "#8B7355") + "20";
  const fg = color ?? "#8B7355";
  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center rounded-xl border border-border bg-white shadow-sm`}
      style={{ backgroundColor: bg, color: fg }}
    >
      <ShoppingBag className={icon} />
    </div>
  );
}
