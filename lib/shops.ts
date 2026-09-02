export type ShopStage =
  | "prospect"
  | "demo_booked"
  | "attended"
  | "payment_link_sent"
  | "paid"
  | "live"
  | "subscription_active";

export type SubscriptionStatus = "active" | "past_due" | "canceled" | null;

export type Shop = {
  id: string;
  business_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  service_area: string | null;
  source: string | null;
  stage: ShopStage;
  pay_token: string;
  stripe_customer_id: string | null;
  stripe_setup_checkout_session_id: string | null;
  stripe_setup_payment_intent_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  refunded: boolean;
  refunded_at: string | null;
  setup_paid_at: string | null;
  live_at: string | null;
  subscription_started_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const STAGE_LABELS: Record<ShopStage, string> = {
  prospect: "Prospect",
  demo_booked: "Demo booked",
  attended: "Attended",
  payment_link_sent: "Pay link sent",
  paid: "Paid",
  live: "Live",
  subscription_active: "Subscription active",
};

export const STAGE_ORDER: ShopStage[] = [
  "prospect",
  "demo_booked",
  "attended",
  "payment_link_sent",
  "paid",
  "live",
  "subscription_active",
];

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
