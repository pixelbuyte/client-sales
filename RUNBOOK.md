# Runbook — after the $2,500 clears

Plain checklist, no UI. Fill in the actual delivery mechanism as it firms up.

## When `payment_events` shows `checkout.session.completed` for a shop

- [ ] Confirm the shop's stage is **Paid** in `/app/shops/[id]`.
- [ ] Reach out to schedule the configuration call/window.
- [ ] Get whatever's needed to configure missed-call/dead-estimate recovery for that shop
      (call-forwarding number, current answering setup, estimate follow-up process — fill in
      the real list once the delivery mechanism is locked).
- [ ] Configure it.
- [ ] Confirm it's working end-to-end with the shop.
- [ ] In `/app/shops/[id]`, click **Mark live**. This starts the $750/month subscription.
- [ ] If "Mark live" falls back to a subscription link (saved card couldn't be charged
      automatically), send that link to the shop the same way you sent the setup link.
- [ ] Confirm in `/app/shops/[id]` that the stage reaches **Subscription active**.

## Funnel reporting gates (per the outbound brief — do not change the offer based on these)

- After 20 sends: report only.
- At 50 sends: look for patterns.
- At 100 sends: keep / modify / kill the offer.

## Open items

- [ ] Final business/brand name → set `NEXT_PUBLIC_BUSINESS_NAME` in Vercel. Until set, the
      landing/pay/demo pages show a bracketed placeholder.
- [x] Public landing page (`app/page.tsx`) — built ("Dispatch Board" direction: work-order/ticket
      motif, warm cream + safety-orange palette matching the rest of the app). Swap directions or
      polish copy any time — this is a first pass, not final.
- [x] `/demo` page — built (before/after scenario walkthrough: missed night call, dead estimate).
- [ ] Short demo video — planned via Motion (`motion_so`), generated from the `/demo` page's
      copy. Requires Motion credits.
- [ ] Real Vercel deployment — needs a project created from the Vercel dashboard (this session's
      Vercel access can't create projects or change project settings). See DEPLOY.md §3.
