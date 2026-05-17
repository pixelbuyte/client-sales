import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { anthropic } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { lookupImages } from "@/lib/productImage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"]);

const MERCHANT_TYPES = [
  "grocery",
  "restaurant",
  "gas",
  "pharmacy",
  "convenience",
  "retail",
  "other",
] as const;

const LineItemSchema = z.object({
  name: z.string(),
  price: z.number().nullable(),
  quantity: z.number().int().nullable(),
});

const ReceiptSchema = z.object({
  merchant: z.string().nullable(),
  merchant_type: z.enum(MERCHANT_TYPES).nullable(),
  order_date: z.string().nullable(),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]).nullable(),
  total: z.number().nullable(),
  items: z.array(LineItemSchema),
});

const SYSTEM = [
  "You extract structured data from a receipt or order confirmation.",
  "Return EVERY purchased line item — do not collapse or summarize. If the receipt has 5 lines, return 5 items.",
  "Skip non-item lines like subtotal, tax, tip, total, change, loyalty discount, balance.",
  "Quantity rules — read carefully: items[].price is ALWAYS the PER-UNIT price, and the line total is price * quantity.",
  "If the receipt clearly shows a per-unit price (e.g. '2 @ 3.99'), set quantity to 2 and price to 3.99.",
  "If the receipt only shows a line total (e.g. 'BANANA x3 ... $5.97' with no per-unit price), set quantity to 1 and price to the line total (5.97). Do NOT divide.",
  "Default quantity to 1 whenever you're unsure.",
  "Return null for any single field you can't read confidently — do not guess.",
  "items[].name: SHOPPER-FRIENDLY product name. Aggressively expand retailer short codes using context from the merchant — examples:",
  "  Walmart 'GV WHL MLK' -> 'Great Value Whole Milk'; 'MM GREEK YGT' -> 'Marketside Greek Yogurt'.",
  "  Target 'UP&UP IBPRFN' -> 'Up & Up Ibuprofen'.",
  "  Trader Joe's 'TJS BRUS SPRT' -> \"Trader Joe's Brussels Sprouts\".",
  "  Costco 'KS PNT BTR' -> 'Kirkland Signature Peanut Butter'.",
  "  Restaurants: keep dish names as printed ('Margherita Pizza', not 'MARG PZA').",
  "  Gas stations: 'UNL REG' -> 'Regular Unleaded Gas'.",
  "  Only expand when you're confident — leave the printed form if the abbreviation is ambiguous.",
  "items[].price: per-unit price in major units (24.99 not 2499). Numbers only.",
  "total: receipt grand total in major units.",
  "currency: 3-letter ISO code if visible; null otherwise.",
  "order_date: ISO 8601 (YYYY-MM-DD).",
  `merchant_type: one of ${MERCHANT_TYPES.join(", ")} based on the merchant name and what's on the receipt. Use 'other' only when nothing fits.`,
].join(" ");

// Map AI merchant_type to the seed category names from supabase/schema.sql.
const MERCHANT_TYPE_TO_CATEGORY: Record<string, string> = {
  grocery: "Groceries",
  restaurant: "Groceries",
  gas: "Travel",
  pharmacy: "Health",
  convenience: "Groceries",
  retail: "Other",
};

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const file = form.get("receipt");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing receipt file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Receipt must be 10MB or smaller." }, { status: 400 });
  }
  if (!ACCEPTED.has(file.type)) {
    return NextResponse.json(
      { error: "File must be PNG, JPEG, WEBP, GIF, or PDF." },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");
  const isPdf = file.type === "application/pdf";

  let client: Anthropic;
  try {
    client = anthropic();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }

  const userBlock: Anthropic.Beta.BetaContentBlockParam = isPdf
    ? {
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: bytes },
      }
    : {
        type: "image",
        source: {
          type: "base64",
          media_type: file.type as "image/png" | "image/jpeg" | "image/webp" | "image/gif",
          data: bytes,
        },
      };

  try {
    const response = await client.beta.messages.parse({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      system: SYSTEM,
      output_config: { effort: "low" },
      output_format: betaZodOutputFormat(ReceiptSchema),
      messages: [
        {
          role: "user",
          content: [
            userBlock,
            { type: "text", text: "Extract the receipt fields and return JSON matching the schema." },
          ],
        },
      ],
    });

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "Could not extract structured fields from this receipt." },
        { status: 422 },
      );
    }

    const parsed = response.parsed_output;

    // Best-effort product photos: curated images for known items, plus Open
    // Food Facts for grocery receipts.
    const useOpenFoodFacts =
      parsed.merchant_type === "grocery" ||
      parsed.merchant_type === "convenience" ||
      parsed.merchant_type === "pharmacy";

    let images: (string | null)[] = parsed.items.map(() => null);
    if (parsed.items.length > 0 && parsed.items.length <= 25) {
      try {
        images = await lookupImages(
          parsed.items.map((it) => it.name),
          parsed.merchant,
          useOpenFoodFacts,
        );
      } catch {
        // never block save on photo lookup failure
      }
    }

    const suggestedCategory = parsed.merchant_type
      ? MERCHANT_TYPE_TO_CATEGORY[parsed.merchant_type] ?? null
      : null;

    return NextResponse.json({
      ...parsed,
      suggested_category: suggestedCategory,
      items: parsed.items.map((it, i) => ({ ...it, image_url: images[i] })),
    });
  } catch (e) {
    if (e instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic ${e.status}: ${e.message}` },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
