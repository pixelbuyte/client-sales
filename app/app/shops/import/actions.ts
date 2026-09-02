"use server";

import Papa from "papaparse";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ImportResult } from "@/components/CsvImportForm";

const MAX_ROWS = 500;
const MAX_BYTES = 2 * 1024 * 1024; // 2MB CSV

const HEADER_SYNONYMS: Record<string, string> = {
  business: "business_name",
  business_name: "business_name",
  shop: "business_name",
  company: "business_name",
  name: "business_name",

  contact: "contact_name",
  contact_name: "contact_name",
  owner: "contact_name",

  email: "contact_email",
  contact_email: "contact_email",

  phone: "contact_phone",
  contact_phone: "contact_phone",

  area: "service_area",
  service_area: "service_area",
  city: "service_area",
  town: "service_area",

  source: "source",
  wave: "source",

  notes: "notes",
  note: "notes",
};

type RawRow = Record<string, string>;

function normalizeHeader(header: string): string {
  const trimmed = header.trim().toLowerCase().replace(/\s+/g, "_");
  return HEADER_SYNONYMS[trimmed] ?? trimmed;
}

function s(v: string | undefined): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

export async function importShops(formData: FormData): Promise<ImportResult> {
  await requireAdmin();
  const admin = createAdminClient();

  const file = formData.get("csv");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, errors: ["Pick a CSV file to import."] };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, errors: ["CSV must be 2MB or smaller."] };
  }

  const text = await file.text();
  const parsed = Papa.parse<RawRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeHeader,
    transform: (v) => (typeof v === "string" ? v.trim() : v),
  });

  if (parsed.errors.length > 0) {
    const e = parsed.errors[0];
    return { ok: false, errors: [`CSV parse error on row ${e.row ?? "?"}: ${e.message}`] };
  }

  const rows = parsed.data.filter((r) => Object.values(r).some((v) => v));
  if (rows.length === 0) {
    return { ok: false, errors: ["The CSV is empty."] };
  }
  if (rows.length > MAX_ROWS) {
    return { ok: false, errors: [`Up to ${MAX_ROWS} rows per import. Split the file and try again.`] };
  }

  const headers = parsed.meta.fields ?? [];
  if (!headers.includes("business_name")) {
    return {
      ok: false,
      errors: ["Missing required column: business_name."],
      helpText:
        "Required: business_name. Optional: contact_name, contact_email, contact_phone, service_area, source, notes.",
    };
  }

  const errors: string[] = [];
  const inserts: Array<Record<string, string | null>> = [];

  rows.forEach((r, i) => {
    const lineNo = i + 2; // header is row 1
    const businessName = s(r.business_name);
    if (!businessName) {
      errors.push(`Row ${lineNo}: business_name is required.`);
      return;
    }
    inserts.push({
      business_name: businessName,
      contact_name: s(r.contact_name),
      contact_email: s(r.contact_email),
      contact_phone: s(r.contact_phone),
      service_area: s(r.service_area),
      source: s(r.source) ?? "csv_import",
      notes: s(r.notes),
    });
  });

  if (errors.length > 0) {
    return {
      ok: false,
      errors: errors.slice(0, 10).concat(errors.length > 10 ? [`…and ${errors.length - 10} more.`] : []),
    };
  }

  const { error } = await admin.from("shops").insert(inserts);
  if (error) {
    return { ok: false, errors: [`Database error: ${error.message}`] };
  }

  revalidatePath("/app");
  revalidatePath("/app/shops");
  redirect(`/app/shops?imported=${inserts.length}`);
}
