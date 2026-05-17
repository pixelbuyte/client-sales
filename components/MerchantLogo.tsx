import Image from "next/image";
import {
  BrandMark,
  brandFromMerchant,
  brandFromPath,
  type BrandId,
} from "@/components/BrandMark";

const SIZES = {
  sm: { box: "h-8 w-8", pad: "p-1", px: "32px" },
  md: { box: "h-10 w-10", pad: "p-1.5", px: "40px" },
  lg: { box: "h-12 w-12", pad: "p-2", px: "48px" },
} as const;

export function MerchantLogo({
  src,
  alt,
  merchant,
  size = "md",
}: {
  src: string;
  alt: string;
  merchant?: string | null;
  size?: keyof typeof SIZES;
}) {
  const brand: BrandId | null =
    brandFromMerchant(merchant) ?? brandFromPath(src);

  if (brand) {
    return <BrandMark brand={brand} size={size} />;
  }

  const s = SIZES[size];
  return (
    <div
      className={`relative ${s.box} shrink-0 overflow-hidden rounded-xl border border-border/70 bg-white shadow-[0_1px_2px_rgba(24,18,10,0.06)] ring-1 ring-black/[0.03]`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={s.px}
        className={`object-contain ${s.pad}`}
      />
    </div>
  );
}
