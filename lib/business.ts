// Single source of truth for the business name shown on the pay page,
// success/cancel pages, marketing site, and Stripe product names.
// Override with NEXT_PUBLIC_BUSINESS_NAME in Vercel if this changes.
export const BUSINESS_NAME = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Afterline";
