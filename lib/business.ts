// Single source of truth for the business name shown on the pay page,
// success/cancel pages, and Stripe product names. Set NEXT_PUBLIC_BUSINESS_NAME
// once the final brand name is picked; this placeholder keeps the app usable
// in the meantime.
export const BUSINESS_NAME = process.env.NEXT_PUBLIC_BUSINESS_NAME || "[Your HVAC Lead Recovery Business]";
