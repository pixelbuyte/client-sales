# Design workspace

Everything in here is a design deliverable, not app code. The live marketing pages in
`app/(marketing)/` use the same palette (see `COLOR-RESEARCH.md`).

```
design/
  COLOR-RESEARCH.md        why the site is blue / green / one orange, with sources
  variants/                four landing-page concept mockups (self-contained HTML)
  screenshots/             PNG renders of the variants and of the live pages
  video/                   two 30-second video compositions (HTML) and their MP4 renders
  fonts/                   the Google Fonts used above, cached locally so everything renders offline
  tools/                   the scripts that produce screenshots and videos
```

## The four concept variations

| # | Name | Angle | Open |
|---|---|---|---|
| 1 | Night Shift | Navy-first. The phone-at-night story on one dark screen. Maximum trust, maximum drama. | `variants/01-night-shift.html` |
| 2 | Sea Paper | Light, editorial, calm. Feels like a well-run office. For owners who distrust anything that looks like software. | `variants/02-sea-paper.html` |
| 3 | Ledger | Money-first. A running tally of recovered dollars and the pricing card up front. For the numbers-driven owner. | `variants/03-ledger.html` |
| 4 | Dispatch Board | The whiteboard on the shop wall, redrawn. Bold, friendly, hand-stamped tickets. | `variants/04-dispatch-board.html` |

All four share the same research-backed palette and the same locked offer ($2,500 setup,
$750/month from go-live). Each carries a small original cartoon illustration drawn in SVG:
the house at night, the desk phone and text bubble, the leaky bucket, the shop van at sunrise.

"Northeast Call Recovery" in the mockups is a placeholder name. The live site reads the real
name from `NEXT_PUBLIC_BUSINESS_NAME`.

## The two videos

| File | Format | Story |
|---|---|---|
| `video/01-the-914-call.mp4` | 1920×1080, 30 s | The 9:14 pm call: it rings, nobody answers, it goes to the next shop. Recovery on, text back in 4 seconds, three tickets stamped Booked, pricing, CTA. |
| `video/02-two-leaks-vertical.mp4` | 1080×1920, 30 s | Vertical social cut. Two leaks in the phone, both fixable, a running tally of what came back, priced below one job, CTA. |

Both are silent. They are built as HTML compositions and rendered locally with Playwright and
ffmpeg, so there are no video credits or third-party services involved. To re-render after
editing a composition:

```bash
node design/tools/render-video.mjs design/video/01-the-914-call.html design/video/01-the-914-call.mp4 1920 1080
node design/tools/render-video.mjs design/video/02-two-leaks-vertical.html design/video/02-two-leaks-vertical.mp4 1080 1920
```

The renderer pauses every CSS animation, seeks the page to each frame's timestamp, and
screenshots it, so a composition is just a page where every motion has an absolute delay. A
composition may also define `window.__seek(ms)` for anything CSS can't animate (the running
total in video 2 uses it).

## Regenerating screenshots

```bash
design/tools/fetch-fonts.sh                       # once, if design/fonts is empty
node design/tools/screenshot.mjs                  # the four variants
node design/tools/screenshot.mjs http://localhost:3000   # plus the live landing + demo pages
```

Requires a global Playwright install (`npm i -g playwright` and a Chromium download).
