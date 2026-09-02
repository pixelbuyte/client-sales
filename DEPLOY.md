# Deploy — HVAC lead recovery payment stack

End-to-end runbook for taking this repo from "merged on main" to "a shop can pay you $2,500."
Order matters — each step assumes the previous one is done.

---

## 1. Supabase

### 1a. Project

1. supabase.com/dashboard → **New project**.
2. Pick a region near you, set a strong DB password.
3. Wait ~2 min for provisioning.

### 1b. Schema

1. Sidebar → **SQL Editor** → **New query**.
2. Paste the contents of `supabase/schema.sql` from this repo.
3. **Run**. Expect "Success. No rows returned." Verify in **Table Editor** that `shops` and
   `payment_events` exist.

### 1c. Auth redirect URLs

Sidebar → **Authentication** → **URL Configuration**:

- **Site URL**: leave for now; set after Vercel deploy.
- **Redirect URLs**:
  - `http://localhost:3000/auth/callback`
  - `https://<vercel-domain>/auth/callback` (fill in after Vercel deploy)

Also consider disabling public sign-up (Authentication → Providers → Email → "Allow new users to
sign up" off), since this project has exactly one intended user (the admin) and `middleware.ts`
only checks "logged in," not "is admin" — the admin-email check happens at the `/app` layout.

### 1d. Grab the keys

Sidebar → **Project Settings** → **API**:

- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (treat like a password, server-only)

---

## 2. Stripe

Do all of this in **test mode** first (toggle top-right in the Stripe dashboard).

### 2a. Products + prices

1. dashboard.stripe.com → **Products** → **Add product**.
2. Product 1: name it (e.g. "`<Your Business>` — Setup"), price **One time**, **$2,500.00 USD**.
   Copy the price ID (`price_…`) → `STRIPE_PRICE_ID_SETUP`.
3. Product 2: name it (e.g. "`<Your Business>` — Monthly"), price **Recurring**, **monthly**,
   **$750.00 USD**. Copy the price ID → `STRIPE_PRICE_ID_SUBSCRIPTION`.

### 2b. API key

Developers → **API keys** → reveal **Secret key** → `STRIPE_SECRET_KEY` (test mode secret first).

### 2c. Payment methods

Settings → **Payment methods**: make sure **Cards** and **ACH direct debit (US bank account)**
are both enabled, so the setup Checkout Session (which requests `["card", "us_bank_account"]`)
can actually offer both.

### 2d. Webhook (do this *after* Vercel deploy so you have a domain)

1. Developers → **Webhooks** → **Add endpoint**.
2. URL: `https://<vercel-domain>/api/webhooks/stripe`
3. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `charge.refunded`
4. Save. Click the endpoint → **Signing secret** → reveal → `STRIPE_WEBHOOK_SECRET`.

For local development, use the Stripe CLI instead:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

It prints a `whsec_…` value — use that as `STRIPE_WEBHOOK_SECRET` locally.

---

## 3. Vercel

### 3a. Import the repo

1. vercel.com/new → **Import Git Repository** → select this repo.
2. Framework preset auto-detects **Next.js**. Don't deploy yet — fill env vars first.

### 3b. Environment variables

Project → **Settings** → **Environment Variables**. Add each (Production + Preview + Development):

```
NEXT_PUBLIC_SUPABASE_URL          = <from 1d>
NEXT_PUBLIC_SUPABASE_ANON_KEY     = <from 1d>
SUPABASE_SERVICE_ROLE_KEY         = <from 1d>
STRIPE_SECRET_KEY                 = <from 2b>
STRIPE_WEBHOOK_SECRET             = <leave blank, fill after 2d>
STRIPE_PRICE_ID_SETUP             = <from 2a>
STRIPE_PRICE_ID_SUBSCRIPTION      = <from 2a>
ADMIN_EMAILS                      = <your email, comma-separated if more than one>
NEXT_PUBLIC_APP_URL               = <leave blank, fill after first deploy>
NEXT_PUBLIC_BUSINESS_NAME         = <your business name>
```

### 3c. First deploy

1. **Deployments** → **Redeploy** (or push a commit).
2. Once it goes green, copy the production URL: `https://<project>.vercel.app`.

### 3d. Backfill the URL-dependent env vars

- `NEXT_PUBLIC_APP_URL` = `https://<project>.vercel.app`
- Add the Stripe webhook from **2d**, then put `STRIPE_WEBHOOK_SECRET` into Vercel.
- In **Supabase → Authentication**, set **Site URL** and add
  `https://<project>.vercel.app/auth/callback` to redirect URLs.

Redeploy after editing env vars (Vercel doesn't hot-reload them).

---

## 4. Happy-path test (Stripe test mode)

1. Sign in at `/login` with an email listed in `ADMIN_EMAILS` → check inbox → click the magic
   link → land on `/app`.
2. `/app/shops/new` → add a test shop.
3. Open the shop → **Generate pay link** → copy the `/pay/[token]` URL.
4. Open that URL in an incognito window. Confirm: correct business name, no "AI"/"chatbot"/
   "platform"/"CRM" wording, and the explicit "$750/mo starts once your system is live, not
   today" line.
5. Click **Pay $2,500 setup**. Use test card `4242 4242 4242 4242`, any future expiry, any CVC.
   Separately, try the "US bank account" test flow (Stripe's test-mode bank flow completes
   instantly).
6. Land on `/pay/[token]/success`.
7. Back in `/app/shops/[id]`: confirm the stage flipped to **Paid**, `stripe_customer_id` /
   `stripe_setup_payment_intent_id` / setup-paid date are populated, and one
   `checkout.session.completed` row appears under Payment history.
8. Click **Mark live**. Confirm in the Stripe test dashboard that a Subscription now exists and
   is `active`. In the tracker, the shop should show **Live** immediately, then **Subscription
   active** once the `customer.subscription.created` webhook lands.
9. `stripe trigger invoice.payment_failed` → confirm `subscription_status` flips to `past_due`
   without changing the shop's stage.
10. Issue a test refund on the setup PaymentIntent (Stripe dashboard → Payments → the charge →
    Refund) → confirm `refunded` / `refunded_at` populate via the `charge.refunded` webhook.
11. Re-send the same webhook event from the Stripe dashboard ("Resend") → confirm no duplicate
    row appears in `payment_events` (idempotency).
12. Confirm `npm run typecheck` and `npm run build` are clean.

Only after this full pass succeeds should you move to step 5.

---

## 5. Flip Stripe to live mode

1. Stripe dashboard → toggle **Test → Live**.
2. Re-create both products/prices in live mode (Stripe doesn't carry them over) →
   `STRIPE_PRICE_ID_SETUP` / `STRIPE_PRICE_ID_SUBSCRIPTION`.
3. Re-create the webhook endpoint in live mode (new signing secret) → `STRIPE_WEBHOOK_SECRET`.
4. In Vercel, swap `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_SETUP`,
   `STRIPE_PRICE_ID_SUBSCRIPTION` to the live values.
5. Redeploy.

---

## Common gotchas

- **Webhook signature verification fails** → you swapped to live mode but kept the test mode
  `STRIPE_WEBHOOK_SECRET`.
- **Magic link redirects to localhost** → you forgot to add the deployed `/auth/callback` URL to
  Supabase redirect URLs.
- **Signed in but redirected back to `/login?error=not_authorized`** → your email isn't in
  `ADMIN_EMAILS`.
- **"Mark live" falls back to a subscription link instead of starting billing immediately** →
  expected when the saved payment method can't be charged off-session (e.g. requires 3DS). Send
  the fallback `/pay/[token]/subscribe` link the same way you send the setup link.
