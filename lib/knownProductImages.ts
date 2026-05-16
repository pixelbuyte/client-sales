// Curated product photos (CC BY-SA / public domain via Wikimedia Commons).
// Served from /public/products — see public/products/ATTRIBUTION.txt.

const BY_NAME: Record<string, string> = {
  "airpods pro": "/products/airpods-pro.jpg",
  "nike air max": "/products/nike-air-max.jpg",
  "nike air max 97": "/products/nike-air-max.jpg",
};

const BY_MERCHANT: Record<string, string> = {
  "whole foods": "/products/whole-foods.png",
  "whole foods market": "/products/whole-foods.png",
};

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Best-effort match for demo items and common merchant/product names. */
export function knownProductImage(
  name: string,
  merchant?: string | null,
): string | null {
  const n = norm(name);
  for (const [key, url] of Object.entries(BY_NAME)) {
    if (n === key || n.includes(key)) return url;
  }
  if (n.includes("whole foods")) return BY_MERCHANT["whole foods"];

  const m = merchant ? norm(merchant) : "";
  if (m) {
    for (const [key, url] of Object.entries(BY_MERCHANT)) {
      if (m === key || m.includes(key)) return url;
    }
  }
  return null;
}
