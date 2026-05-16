// Best-effort product photo lookup. We try Open Food Facts first (free,
// no key, broad grocery coverage). For non-grocery items the lookup is
// expected to miss, in which case we return null and the UI falls back
// to a generic icon. This module never throws — callers can Promise.all
// without try/catch.

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

export async function lookupProductImage(name: string): Promise<string | null> {
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

// Run lookups in parallel with a hard cap so a slow OFF response can't
// stall the whole scan. Returns the same-length array, null where missing.
export async function lookupImages(names: string[]): Promise<(string | null)[]> {
  return Promise.all(names.map((n) => lookupProductImage(n)));
}
