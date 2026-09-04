// Inline SVG illustrations for concept 02. All decorative (aria-hidden),
// drawn to feel like ink on paper rather than icons. No filters, so they
// rasterize once and never cost a scroll frame.

const DISPLAY = "var(--display)";
const SANS = "var(--sans)";

/* A house at 9:14 pm. One window lit, the chimney cold, the thermostat at 54. */
export function NightHouse() {
  return (
    <svg viewBox="0 0 600 440" aria-hidden="true" role="presentation">
      <defs>
        <linearGradient id="c02-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2219" />
          <stop offset="1" stopColor="#1b1712" />
        </linearGradient>
        <radialGradient id="c02-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e9a06a" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#c8552b" stopOpacity="0.18" />
          <stop offset="1" stopColor="#c8552b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="c02-win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c893" />
          <stop offset="1" stopColor="#e08a4e" />
        </linearGradient>
      </defs>
      <rect width="600" height="440" fill="url(#c02-sky)" />

      {/* stars */}
      <g fill="#f3e4c6" opacity="0.7">
        <circle cx="62" cy="58" r="1.4" />
        <circle cx="128" cy="96" r="1" />
        <circle cx="210" cy="40" r="1.6" />
        <circle cx="300" cy="72" r="1" />
        <circle cx="388" cy="34" r="1.3" />
        <circle cx="440" cy="120" r="1" />
        <circle cx="556" cy="150" r="1.2" />
        <circle cx="90" cy="150" r="1" />
        <circle cx="520" cy="46" r="1" />
      </g>

      {/* moon */}
      <circle cx="500" cy="82" r="34" fill="#f3e4c6" />
      <circle cx="514" cy="72" r="30" fill="#25201a" />

      {/* ground */}
      <path
        d="M-10 342 C 120 332, 260 350, 400 340 S 560 336, 620 344 L620 450 L-10 450 Z"
        fill="#241d16"
      />
      <path
        d="M-10 342 C 120 332, 260 350, 400 340 S 560 336, 620 344"
        fill="none"
        stroke="#e6dccb"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />

      {/* bare tree */}
      <g fill="none" stroke="#e6dccb" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round">
        <path d="M540 340 C 538 300, 544 270, 536 232" />
        <path d="M538 290 C 520 280, 508 262, 506 240" />
        <path d="M540 268 C 556 258, 566 246, 570 226" />
        <path d="M537 250 C 528 240, 524 226, 526 214" />
        <path d="M539 236 C 548 230, 552 220, 552 210" />
      </g>

      {/* window glow (drawn before the house so it reads as light spilling) */}
      <circle cx="372" cy="266" r="110" fill="url(#c02-glow)" />

      {/* house body */}
      <path
        d="M172 206 L 428 204 L 430 342 L 170 342 Z"
        fill="#2c241c"
        stroke="#e6dccb"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* roof */}
      <path
        d="M150 208 L 300 108 L 452 206"
        fill="#221b15"
        stroke="#e6dccb"
        strokeOpacity="0.85"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M160 208 L 300 116 L 442 206 Z" fill="#2a221a" />
      {/* chimney, cold */}
      <path
        d="M378 150 L 378 122 L 408 122 L 408 170"
        fill="#2c241c"
        stroke="#e6dccb"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* door */}
      <path
        d="M284 342 L 284 272 Q 304 262 324 272 L 324 342"
        fill="#1b1712"
        stroke="#e6dccb"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <circle cx="316" cy="308" r="2.2" fill="#e6dccb" opacity="0.7" />
      {/* dark window */}
      <rect x="202" y="236" width="54" height="52" rx="3" fill="#1b1712" stroke="#e6dccb" strokeOpacity="0.5" strokeWidth="2" />
      <path d="M229 236 V288 M202 262 H256" stroke="#e6dccb" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* lit window */}
      <rect x="344" y="236" width="56" height="52" rx="3" fill="url(#c02-win)" stroke="#f6c893" strokeWidth="2" />
      <path d="M372 236 V288 M344 262 H400" stroke="#b04722" strokeOpacity="0.55" strokeWidth="2" />
      {/* someone standing at the window */}
      <path d="M362 288 L 362 268 Q 372 256 382 268 L 382 288 Z" fill="#8a3d1f" opacity="0.8" />
      <circle cx="372" cy="257" r="6" fill="#8a3d1f" opacity="0.8" />

      {/* steps + path */}
      <path d="M278 342 L 330 342 L 336 352 L 272 352 Z" fill="#2c241c" stroke="#e6dccb" strokeOpacity="0.4" strokeWidth="1.5" />
      <path d="M304 352 C 300 380, 260 400, 200 420" fill="none" stroke="#e6dccb" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 6" />

      {/* mailbox */}
      <g fill="none" stroke="#e6dccb" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round">
        <path d="M110 342 V 300" />
        <path d="M96 300 h 30 a 8 8 0 0 0 0 -16 h -30 a 8 8 0 0 0 0 16 z" fill="#2c241c" />
      </g>

      {/* thermostat tag, pinned to the plate like a note */}
      <g transform="translate(40 178) rotate(-3)">
        <rect x="0" y="0" width="122" height="88" rx="8" fill="#fbf6ee" stroke="#e6dccb" strokeWidth="1.5" />
        <circle cx="14" cy="12" r="3" fill="#c8552b" />
        <text x="14" y="30" fontFamily={SANS} fontSize="9.5" fontWeight="700" letterSpacing="1.8" fill="#7a6c5e">
          INSIDE
        </text>
        <text x="12" y="70" fontFamily={DISPLAY} fontSize="44" fill="#b23a2e" letterSpacing="-1.5">
          54°
        </text>
        <text x="72" y="70" fontFamily={SANS} fontSize="10" fill="#7a6c5e">
          set 68
        </text>
      </g>

      {/* the time, hand-lettered in the corner */}
      <text x="556" y="410" textAnchor="end" fontFamily={DISPLAY} fontStyle="italic" fontSize="28" fill="#f3e4c6" fillOpacity="0.85">
        9:14 pm
      </text>
    </svg>
  );
}

/* A phone with the text that went back, and the reply that came in. */
export function PhoneText() {
  return (
    <svg viewBox="0 0 440 480" aria-hidden="true" role="presentation">
      <defs>
        <radialGradient id="c02-pglow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#c8552b" stopOpacity="0.16" />
          <stop offset="1" stopColor="#c8552b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="220" cy="240" r="230" fill="url(#c02-pglow)" />
      <g transform="translate(96 26) rotate(-4 124 214)">
        {/* phone body */}
        <rect x="0" y="0" width="248" height="428" rx="34" fill="#1b1712" />
        <rect x="10" y="10" width="228" height="408" rx="26" fill="#fbf6ee" />
        <rect x="88" y="18" width="72" height="8" rx="4" fill="#1b1712" opacity="0.85" />

        {/* status */}
        <text x="26" y="58" fontFamily={SANS} fontSize="11" fontWeight="700" letterSpacing="1.6" fill="#7a6c5e">
          9:14 PM
        </text>
        <text x="222" y="58" textAnchor="end" fontFamily={SANS} fontSize="11" fontWeight="600" fill="#b23a2e">
          Missed call
        </text>
        <line x1="26" y1="70" x2="222" y2="70" stroke="#e6dccb" strokeWidth="1" />

        {/* shop's text back */}
        <g>
          <path
            d="M26 92 h 158 a 12 12 0 0 1 12 12 v 70 a 12 12 0 0 1 -12 12 h -146 l -12 12 z"
            fill="#fffdf9"
            stroke="#e6dccb"
            strokeWidth="1.2"
          />
          <text fontFamily={SANS} fontSize="12" fill="#1b1712">
            <tspan x="40" y="112">Sorry we missed you — this is</tspan>
            <tspan x="40" y="129">the shop. Is this urgent, or can</tspan>
            <tspan x="40" y="146">we call you back first thing?</tspan>
            <tspan x="40" y="167" fill="#7a6c5e" fontSize="10.5">Sent 9:14 pm</tspan>
          </text>
        </g>

        {/* customer's reply */}
        <g>
          <path
            d="M222 214 h -150 a 12 12 0 0 0 -12 12 v 50 a 12 12 0 0 0 12 12 h 138 l 12 12 z"
            fill="#c8552b"
          />
          <text fontFamily={SANS} fontSize="12" fill="#fbf6ee">
            <tspan x="72" y="236">Urgent. Furnace won&apos;t fire,</tspan>
            <tspan x="72" y="253">house is down to 54.</tspan>
            <tspan x="72" y="273" fill="#f6c893" fontSize="10.5">9:16 pm</tspan>
          </text>
        </g>

        {/* callback window */}
        <g>
          <path
            d="M26 320 h 158 a 12 12 0 0 1 12 12 v 34 a 12 12 0 0 1 -12 12 h -146 l -12 12 z"
            fill="#fffdf9"
            stroke="#e6dccb"
            strokeWidth="1.2"
          />
          <text fontFamily={SANS} fontSize="12" fill="#1b1712">
            <tspan x="40" y="340">Flagged for tonight&apos;s on-call.</tspan>
            <tspan x="40" y="357">Someone will call within the hour.</tspan>
          </text>
        </g>
        <rect x="96" y="398" width="56" height="4" rx="2" fill="#1b1712" opacity="0.6" />
      </g>
      {/* a hand-drawn "seconds" note */}
      <g transform="translate(24 402)">
        <path d="M0 22 C 30 6, 60 4, 84 18" fill="none" stroke="#c8552b" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M78 10 L 86 18 L 76 22" fill="none" stroke="#c8552b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="0" y="48" fontFamily={DISPLAY} fontStyle="italic" fontSize="17" fill="#c8552b">
          within seconds
        </text>
      </g>
    </svg>
  );
}

/* A paper estimate that has been sitting on a desk for eighteen days. */
export function PaperEstimate() {
  return (
    <svg viewBox="0 0 460 520" aria-hidden="true" role="presentation">
      <g transform="rotate(-2.5 230 260)">
        {/* shadow sheet behind */}
        <rect x="70" y="52" width="330" height="430" rx="4" fill="#e6dccb" opacity="0.6" transform="rotate(2 230 260)" />
        {/* the sheet */}
        <rect x="60" y="40" width="330" height="430" rx="4" fill="#fffdf9" stroke="#e6dccb" strokeWidth="1.5" />

        {/* header */}
        <text x="88" y="86" fontFamily={DISPLAY} fontSize="26" fill="#1b1712" letterSpacing="-0.5">
          Estimate
        </text>
        <text x="362" y="86" textAnchor="end" fontFamily={SANS} fontSize="11" fontWeight="700" letterSpacing="1.6" fill="#7a6c5e">
          No. 4471
        </text>
        <line x1="88" y1="100" x2="362" y2="100" stroke="#1b1712" strokeWidth="1.2" />

        {/* customer + address, hand-written feel */}
        <text x="88" y="124" fontFamily={SANS} fontSize="12" fill="#4a4038">
          Pat M. · 14 Elm St, Dedham
        </text>
        <text x="88" y="142" fontFamily={SANS} fontSize="12" fill="#4a4038">
          96% two-stage furnace, remove &amp; replace
        </text>

        {/* line items as strokes */}
        <g stroke="#d9cdb8" strokeWidth="2" strokeLinecap="round">
          <path d="M88 176 h 160" />
          <path d="M88 198 h 130" />
          <path d="M88 220 h 176" />
          <path d="M88 242 h 112" />
          <path d="M88 264 h 150" />
        </g>
        <g fontFamily={SANS} fontSize="11.5" fill="#7a6c5e" textAnchor="end">
          <text x="362" y="180">3,900</text>
          <text x="362" y="202">2,650</text>
          <text x="362" y="224">1,200</text>
          <text x="362" y="246">850</text>
          <text x="362" y="268">800</text>
        </g>
        <line x1="88" y1="286" x2="362" y2="286" stroke="#1b1712" strokeWidth="1.2" />
        <text x="88" y="320" fontFamily={SANS} fontSize="11" fontWeight="700" letterSpacing="1.6" fill="#7a6c5e">
          TOTAL
        </text>
        <text x="362" y="324" textAnchor="end" fontFamily={DISPLAY} fontSize="32" fill="#1b1712" letterSpacing="-1">
          $9,400
        </text>

        {/* signature line */}
        <line x1="88" y1="420" x2="240" y2="420" stroke="#d9cdb8" strokeWidth="1.5" />
        <text x="88" y="436" fontFamily={SANS} fontSize="10" fill="#7a6c5e">
          Customer approval
        </text>

        {/* coffee ring */}
        <g fill="none" stroke="#b58a5a" strokeOpacity="0.45">
          <circle cx="300" cy="392" r="44" strokeWidth="6" strokeDasharray="200 30 40 12" />
          <circle cx="300" cy="392" r="38" strokeWidth="1.5" strokeDasharray="60 20" />
        </g>

        {/* stamp */}
        <g transform="translate(120 352) rotate(-8)">
          <rect x="0" y="0" width="150" height="40" rx="5" fill="#f5e1de" stroke="#b23a2e" strokeWidth="2" />
          <text x="75" y="18" textAnchor="middle" fontFamily={SANS} fontSize="12" fontWeight="800" letterSpacing="2.4" fill="#b23a2e">
            NO REPLY
          </text>
          <text x="75" y="32" textAnchor="middle" fontFamily={SANS} fontSize="9.5" fill="#b23a2e">
            sent 18 days ago
          </text>
        </g>

        {/* paperclip */}
        <path
          d="M330 34 v 60 a 12 12 0 0 1 -24 0 v -50 a 7 7 0 0 1 14 0 v 44"
          fill="none"
          stroke="#7a6c5e"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/* Side view of a service van, drawn in ink. */
export function ServiceVan({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const stroke = tone === "ink" ? "#1b1712" : "#f3e4c6";
  const fill = tone === "ink" ? "#fffdf9" : "transparent";
  const accent = "#c8552b";
  return (
    <svg viewBox="0 0 520 300" aria-hidden="true" role="presentation">
      <g fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {/* ladder rack */}
        <path d="M120 84 h 250" />
        <path d="M140 84 v -18 h 210 v 18" />
        <path d="M172 66 v 18 M204 66 v 18 M236 66 v 18 M268 66 v 18 M300 66 v 18 M332 66 v 18" strokeWidth="1.8" />
        {/* body */}
        <path
          d="M84 214 L 84 128 Q 84 100 112 100 L 330 100 L 386 100 Q 410 100 424 118 L 458 170 Q 470 186 470 202 L 470 214 Z"
          fill={fill}
        />
        {/* windshield */}
        <path d="M344 108 L 386 108 Q 402 108 412 122 L 440 164 L 344 164 Z" fill={tone === "ink" ? "#e6dccb" : "transparent"} />
        {/* side window */}
        <rect x="264" y="108" width="68" height="52" rx="4" fill={tone === "ink" ? "#e6dccb" : "transparent"} />
        {/* door seam */}
        <path d="M334 100 V 214" strokeWidth="1.8" />
        <path d="M264 100 V 214" strokeWidth="1.8" />
        {/* handles */}
        <path d="M300 178 h 18 M348 178 h 18" strokeWidth="2.2" />
        {/* bumper + lights */}
        <path d="M470 214 h 14 v -20 h -14" />
        <path d="M84 214 h -12 v -20 h 12" />
        <circle cx="462" cy="190" r="5" fill="#f6c893" />
        <path d="M100 196 h 8" stroke="#b23a2e" strokeWidth="3" />
        {/* wheels */}
        <circle cx="150" cy="218" r="30" fill={tone === "ink" ? "#1b1712" : "transparent"} />
        <circle cx="150" cy="218" r="12" fill={tone === "ink" ? "#fffdf9" : "transparent"} />
        <circle cx="404" cy="218" r="30" fill={tone === "ink" ? "#1b1712" : "transparent"} />
        <circle cx="404" cy="218" r="12" fill={tone === "ink" ? "#fffdf9" : "transparent"} />
        {/* ground */}
        <path d="M40 250 C 140 244, 300 256, 500 248" strokeOpacity="0.4" strokeWidth="1.8" />
      </g>
      {/* stripe + shop name */}
      <path d="M96 170 h 160" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      <text x="104" y="150" fontFamily={DISPLAY} fontStyle="italic" fontSize="26" fill={stroke} letterSpacing="-0.5">
        Your shop
      </text>
      <text x="104" y="198" fontFamily={SANS} fontSize="10.5" fontWeight="700" letterSpacing="1.8" fill={tone === "ink" ? "#7a6c5e" : "#f3e4c6"}>
        HEATING · COOLING · SINCE 1994
      </text>
    </svg>
  );
}

/* Small check for lists. */
export function Tick({ size = 15 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

export function Cross({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}
