# HVAC Lead Recovery — payment + tracker

Payment and prospect-tracking stack for a missed-call + dead-estimate recovery service sold to
HVAC shops in Greater Boston / eastern MA.

Stack: Next.js 14 App Router · TypeScript · Tailwind · Supabase (Postgres + Auth) · Stripe ·
Vercel.

## The offer (locked — don't change without asking)

- **$2,500 one-time setup fee**, paid in full before any work starts.
- **$750/month**, starting only once the shop's system is live — never at signing.
- Sold as "recovered jobs / missed night calls / dead estimates," never as "AI," a chatbot, a
  CRM, or a platform.
- **A pay link is never sent automatically from the tracker.** The `/pay/[token]` link is
  generated in the tracker, copied by hand, and sent only after a prospect has said yes on a
  call.
- **Exception:** a generic Stripe Payment Link (`buy.stripe.com/...`, created directly in the
  Stripe Dashboard, not by this app) can be handed to a bot or other automated channel to send
  at its own judgment. Since that link carries no `shop_id`, the webhook attributes it to a shop
  by matching the payer's email instead — see "Stripe Payment Link attribution" below.

## Funnel

```
prospect → demo_booked → attended → payment_link_sent → paid → live → subscription_active
```

Cold email (handled outside this repo) → `/demo` (5-min self-serve demo) → 15-min call → verbal
yes → admin generates a `/pay/[token]` link and sends it manually → shop pays the $2,500 setup →
admin configures the shop → admin marks it "live," which starts the $750/month subscription.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in keys — see DEPLOY.md
# apply supabase/schema.sql in the Supabase SQL editor
pnpm dev
```

## Routes

| Path | Auth | Purpose |
|---|---|---|
| `/` | public | Landing page |
| `/demo` | public | Self-serve product demo (before/after scenario walkthrough) |
| `/pay/[token]` | public, token-gated | Agreement summary + "Pay $2,500 setup" |
| `/pay/[token]/success` | public, token-gated | Post-payment confirmation |
| `/pay/[token]/cancel` | public, token-gated | Checkout canceled, retry |
| `/pay/[token]/subscribe` | public, token-gated | Fallback subscription checkout (only used if the automatic go-live charge fails) |
| `/login` | public | Magic-link sign-in |
| `/app` | admin only | Tracker dashboard (pipeline counts, MRR) |
| `/app/shops` | admin only | Shop list + stage filters |
| `/app/shops/new` | admin only | Add a shop manually |
| `/app/shops/import` | admin only | CSV bulk import |
| `/app/shops/[id]` | admin only | Shop detail — contact info, Stripe IDs, stage actions |
| `/api/webhooks/stripe` | service | Stripe → Supabase sync |

"Admin only" means the signed-in Supabase user's email is in `ADMIN_EMAILS`; anyone else is
redirected to `/login`.

## Stripe Payment Link attribution

A shop created through the normal tracker flow always pays via its own `/pay/[token]` page, whose
Checkout Session carries `client_reference_id`/`metadata.shop_id`, so the webhook always knows
which shop to update.

A payment through a generic Stripe Payment Link (e.g. one handed to a bot to distribute) has no
`shop_id` — it never touched this app. When `checkout.session.completed` fires for a payment-mode
session with no `shop_id`, the webhook (`app/api/webhooks/stripe/route.ts`,
`findOrCreateShopByEmail`) looks up a `shops` row by the payer's email (`customer_details.email`,
lowercased). If one matches, that shop is updated and advanced to `paid` as usual. If none
matches, a new shop is created (`source: "stripe_payment_link"`, `business_name` falling back to
`"Unknown — <email>"` if Stripe didn't collect a name) so the payment still lands in the tracker
instead of disappearing.

Because the lookup is case-insensitive, every insert path (`createShop`, CSV `importShops`, and
the webhook itself) lowercases `contact_email` before writing it, so a shop added manually or by
CSV still gets matched correctly if its contact later pays through the generic link.

## Environment variables

See `.env.example`. Never commit `.env.local`.

## Testing the Stripe flow

See the happy-path test script in `DEPLOY.md` — run it in Stripe test mode before ever flipping
to live keys.

## What's intentionally not here

- No outbound email sending / cold-email tooling — that's handled outside this repo and stays
  on hold.
- No AI-forward copy anywhere customer-facing.
- No full CRM — the tracker is one table (`shops`) with a fixed 7-stage funnel, not a
  general-purpose pipeline builder.
