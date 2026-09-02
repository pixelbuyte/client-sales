# Color research — what makes a shop owner trust us and pay

Short version: **blue earns the trust, green signals the money coming back, orange gets the click.**
The marketing surface now runs on an ocean palette (deep navy + sea-paper) with a single warm
orange reserved for the one action we want: watching the demo, then booking the call.

## What the research says

| Finding | Source |
|---|---|
| Blue is the color consumers most associate with trust; a widely cited Adobe survey puts it at 54% of respondents, first across industries. | [colorpick.app — Color & Trust](https://colorpick.app/blog/color-trust-credibility) |
| Across 2,588 A/B tests, blue CTAs showed the largest average lift (31%), ahead of green (22%) and red (16%). | [Neil Patel — Which CTA color converts best](https://neilpatel.com/marketing-stats/cta-color-conversion-rates/) |
| Blue buttons tend to win on high-value transactions where the buyer needs reassurance before committing. | [Slider Revolution — What color makes people want to buy](https://www.sliderrevolution.com/design/what-color-makes-people-want-to-buy/) |
| Orange creates urgency and friendliness rather than authority; in e-commerce tests orange CTAs edged both green and blue on average conversion. | [ClickGuard — CTA colors for landing pages](https://www.clickguard.com/blog/call-to-action-colors-for-landing-pages/), [WiziShop](https://wizishop.com/blog/what-colors-make-people-want-to-buy) |
| The real variable is contrast: a CTA converts when it is the only thing on the page in its color. | [Ritner Digital — What conversion data says about brand colors](https://www.ritnerdigital.com/blog/what-the-conversion-data-actually-says-about-brand-colors) |
| Red works for clearance and urgency but performs poorly on considered, high-ticket purchases. | [Omniconvert — Persuasive colors](https://www.omniconvert.com/blog/color-persuasion/) |
| Green reads as growth, money and "go"; shoppers report paying more for products framed in green. | [Designaphy — Color psychology for brand trust](https://designaphy.com/insights/color-psychology) |
| Users spend ~42% longer looking at colorful layouts than monochrome ones, so a flat single-hue page loses attention. | [Review42 — Color psychology statistics](https://resources.review42.com/color-psychology-facts/) |

Caveat that every one of these sources makes: the numbers are averages across unrelated
businesses. Nothing here replaces testing the page with real HVAC owners. The palette below is
the best-supported starting point, not a guarantee.

## Why this matters for a $2,500 + $750/mo sale to an HVAC owner

- It is a **considered purchase**, not an impulse buy. The buyer is a business owner who has been
  pitched "AI" and "CRMs" before. Trust colors (blue) and calm surfaces matter more than urgency.
- The page tells a **night-time story** (the 9:14 pm call). Deep navy is both the trust color and
  the literal setting, so the palette carries the story instead of fighting it.
- Only one thing should be orange: the button that starts the funnel. Everything else stays cool
  so the button is the highest-contrast object on every screen.
- **Green** is used only for outcomes: "Booked", recovered jobs, the money coming back. Red is
  used only for the loss ("Missed"), never for anything we want them to click.

## The palette

| Token | Hex | Job |
|---|---|---|
| `ocean` | `#0B2A3F` | Hero and final-CTA bands. The night. Trust. |
| `ocean-deep` | `#071E2E` | Darkest ground behind the hero. |
| `sea-bg` | `#EAF1F5` | Page ground for daytime sections. Sea-paper, not cream. |
| `sea-surface` | `#FFFFFF` | Cards and tickets. |
| `sea-raised` | `#F2F7FA` | Card headers, strips. |
| `sea-line` | `#D3DFE8` | Hairlines. |
| `sea-ink` | `#0E1F2D` | Body text. |
| `sea-muted` | `#4F6472` | Secondary text. |
| `trust` | `#1E5F8C` | Eyebrows, links, the accent that used to be clay. |
| `trust-hover` | `#174B70` | |
| `trust-soft` | `#E1EDF6` | Tints. |
| `cta` | `#F08A24` | The one button color. Nothing else on the page is orange. |
| `cta-hover` | `#D9771A` | |
| `stamp-booked` | `#1F8A5B` | Recovered / booked / money back. |
| `stamp-missed` | `#C0392B` | Lost call. Only ever a loss marker. |

Contrast checks (WCAG): white on `ocean` 14.5:1, `sea-ink` on `sea-bg` 14.1:1, `sea-ink` on
`cta` 8.1:1, white on `trust` 6.4:1, `trust` on `sea-bg` 5.5:1. All pass AA for text, and the
CTA passes AAA with dark text on it.

## The four concept variations

The four mockups in `design/variants/` all use this research but push it in different
directions so the owner can see the range before picking one:

1. **Night Shift** — navy-first, the phone-at-night story told in one dark screen. Maximum trust,
   maximum drama. Orange CTA glows against it.
2. **Sea Paper** — light, editorial, calm. Blue-grey paper with a dispatch-ticket motif. Feels
   like a well-run office. Best for owners who distrust anything that looks like software.
3. **Ledger** — money-first. Green outcomes, a running tally of recovered dollars, the pricing
   card front and center. For the numbers-driven owner.
4. **Dispatch Board** — the whiteboard on the shop wall, redrawn. Bold, high-contrast, hand-
   stamped tickets on a cork-blue board. Friendliest of the four.
