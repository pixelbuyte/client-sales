// Single source of truth for the business name shown on the marketing pages,
// the pay page, success/cancel pages, and Stripe product names. Override with
// NEXT_PUBLIC_BUSINESS_NAME to rename the business without touching code.
export const BUSINESS_NAME = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Afterline";
