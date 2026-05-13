// Best-effort product image lookup. Tries Open Food Facts first (great for
// groceries; free, no key, no auth), then falls back to a high-res favicon
// from Google's icon service for the merchant — recognizable enough that
// a row like "AirPods Pro" from "Apple" shows the Apple logo instead of a
// generic icon. Returns null only when both lookups fail.

type OffSearchResponse = {
  products?: Array<{
    image_url?: string;
    image_front_url?: string;
    image_front_small_url?: string;
  }>;
};

const OFF_TIMEOUT_MS = 3500;

async function lookupOpenFoodFacts(name: string): Promise<string | null> {
  const q = encodeURIComponent(name.slice(0, 80));
  const url = `https://world.openfoodfacts.org/api/v2/search?search_terms=${q}&fields=image_front_small_url,image_front_url,image_url&page_size=1`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "PurchasePing/1.0 (https://purchaseping.com)",
      },
      signal: AbortSignal.timeout(OFF_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as OffSearchResponse;
    const p = data.products?.[0];
    return (
      p?.image_front_small_url ??
      p?.image_front_url ??
      p?.image_url ??
      null
    );
  } catch {
    return null;
  }
}

// Guess a likely domain for the merchant. We only need *something* that
// resolves to a recognizable logo; Google's icon service silently falls
// back to a default icon if the domain doesn't exist, so this is safe.
function merchantFavicon(merchant: string | null): string | null {
  if (!merchant) return null;
  const slug = merchant
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "");
  if (!slug) return null;
  return `https://www.google.com/s2/favicons?domain=${slug}.com&sz=128`;
}

export async function findProductImage(
  name: string,
  merchant: string | null,
): Promise<string | null> {
  if (!name || name.trim().length < 2) return merchantFavicon(merchant);
  const off = await lookupOpenFoodFacts(name);
  if (off) return off;
  return merchantFavicon(merchant);
}
