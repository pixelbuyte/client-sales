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
- **A pay link is never sent automatically.** It's generated in the tracker, copied by hand, and
  sent only after a prospect has said yes on a call.

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
| `/` | public | Landing page (placeholder — see RUNBOOK.md) |
| `/demo` | public | Self-serve product demo (not yet built) |
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
