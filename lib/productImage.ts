// Best-effort product photo lookup. Known demo products (AirPods, Nike Air Max,
// Whole Foods) resolve from /public/products first, then Open Food Facts for
// groceries. This module never throws — callers can Promise.all without try/catch.

import { knownProductImage } from "@/lib/knownProductImages";

const OFF_SEARCH =
  "https://world.openfoodfacts.org/cgi/search.pl" +
  "?search_simple=1&action=process&json=1&page_size=1&fields=image_front_url,image_url";

const FETCH_TIMEOUT_MS = 2500;

async function fetchWithTimeout(url: string): Promise<Response | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "purchase-ping/1.0 (image-lookup)" },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function lookupProductImage(
  name: string,
  merchant?: string | null,
  useOpenFoodFacts = false,
): Promise<string | null> {
  const known = knownProductImage(name, merchant);
  if (known) return known;
  if (!useOpenFoodFacts) return null;

  const q = name.trim();
  if (q.length < 3) return null;
  const url = `${OFF_SEARCH}&search_terms=${encodeURIComponent(q)}`;
  const res = await fetchWithTimeout(url);
  if (!res || !res.ok) return null;
  try {
    const body = (await res.json()) as {
      products?: Array<{ image_front_url?: string; image_url?: string }>;
    };
    const p = body.products?.[0];
    return p?.image_front_url ?? p?.image_url ?? null;
  } catch {
    return null;
  }
}

export async function lookupImages(
  names: string[],
  merchant?: string | null,
  useOpenFoodFacts = false,
): Promise<(string | null)[]> {
  return Promise.all(
    names.map((n) => lookupProductImage(n, merchant, useOpenFoodFacts)),
  );
}
