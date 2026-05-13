-- 0003 — Optional product image per line item.
-- Filled manually today; future work auto-detects from merchant/item name
-- via the OCR vision pass or an external product database lookup.

alter table purchases
  add column if not exists image_url text;
