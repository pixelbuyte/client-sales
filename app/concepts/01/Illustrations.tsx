// Original inline-SVG illustrations for concept 01. Every one is decorative
// (aria-hidden) — the copy next to it carries the meaning. Colors are held
// to the ocean palette; the only warm tone is the lit window, and that is a
// cream, not the CTA orange.

type Props = { className?: string };

/* A house at night. One lit window, a thin plume from the chimney. */
export function HouseNight({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 640 400"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="c1-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#071E2E" />
          <stop offset="0.6" stopColor="#0B2A3F" />
          <stop offset="1" stopColor="#123A55" />
        </linearGradient>
        <radialGradient id="c1-win-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F3E3BC" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#F3E3BC" stopOpacity="0.12" />
          <stop offset="1" stopColor="#F3E3BC" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="c1-lamp-glow" cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor="#DCE7EE" stopOpacity="0.22" />
          <stop offset="1" stopColor="#DCE7EE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="400" fill="url(#c1-sky)" />
      {/* stars */}
      <g fill="#DCE7EE" className="c1-stars">
        <circle cx="52" cy="48" r="1.4" opacity="0.8" />
        <circle cx="128" cy="84" r="1" opacity="0.5" />
        <circle cx="210" cy="36" r="1.2" opacity="0.7" />
        <circle cx="296" cy="72" r="0.9" opacity="0.5" />
        <circle cx="372" cy="30" r="1.3" opacity="0.8" />
        <circle cx="442" cy="96" r="1" opacity="0.5" />
        <circle cx="560" cy="44" r="1.5" opacity="0.8" />
        <circle cx="604" cy="118" r="1" opacity="0.5" />
        <circle cx="480" cy="60" r="0.9" opacity="0.6" />
        <circle cx="160" cy="130" r="0.8" opacity="0.4" />
      </g>
      {/* moon */}
      <circle cx="528" cy="86" r="26" fill="#DCE7EE" opacity="0.9" />
      <circle cx="516" cy="76" r="24" fill="#0B2A3F" />
      {/* treeline */}
      <path
        d="M0 262 L40 226 L70 262 L96 214 L128 262 L150 236 L176 262 L640 262 L640 300 L0 300 Z"
        fill="#08202F"
      />
      <path d="M470 262 L500 220 L532 262 L556 232 L582 262 L606 228 L640 262 Z" fill="#08202F" />
      {/* ground */}
      <rect x="0" y="296" width="640" height="104" fill="#061826" />
      <path d="M0 300 Q320 284 640 300 L640 310 L0 310 Z" fill="#0A2437" />
      {/* street lamp */}
      <path d="M92 300 L92 150" stroke="#2C5A78" strokeWidth="4" strokeLinecap="round" />
      <path d="M92 150 Q92 140 106 140 L118 140" stroke="#2C5A78" strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect x="112" y="136" width="18" height="10" rx="2" fill="#DCE7EE" opacity="0.9" />
      <path d="M121 146 L60 300 L182 300 Z" fill="url(#c1-lamp-glow)" />
      {/* house */}
      <rect x="232" y="196" width="230" height="104" fill="#14364F" />
      <polygon points="214,198 347,102 480,198" fill="#1B4560" />
      <polygon points="232,196 347,114 462,196" fill="#173F5A" />
      <rect x="410" y="122" width="26" height="62" fill="#1B4560" />
      <rect x="406" y="118" width="34" height="8" fill="#2C5A78" />
      {/* plume */}
      <path
        className="c1-plume"
        d="M423 114 c-8 -14 6 -22 -2 -36 c-6 -12 6 -18 0 -32"
        stroke="#B8C9D6"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* door */}
      <rect x="332" y="240" width="32" height="60" rx="2" fill="#0B2A3F" />
      <circle cx="358" cy="272" r="2" fill="#9DB4C4" />
      {/* dark windows */}
      <rect x="392" y="216" width="42" height="40" rx="2" fill="#0B2A3F" stroke="#2C5A78" strokeWidth="2" />
      <rect x="262" y="146" width="0" height="0" />
      {/* lit window */}
      <circle cx="283" cy="236" r="70" fill="url(#c1-win-glow)" />
      <rect x="262" y="216" width="42" height="40" rx="2" fill="#F3E3BC" />
      <rect x="282" y="216" width="2" height="40" fill="#14364F" />
      <rect x="262" y="235" width="42" height="2" fill="#14364F" />
      <path d="M266 254 L300 254" stroke="#14364F" strokeWidth="1" opacity="0.4" />
      {/* a figure at the lit window — a shoulder and head, nothing more */}
      <circle cx="292" cy="242" r="4.5" fill="#14364F" opacity="0.7" />
      <path d="M285 256 Q292 246 299 256 Z" fill="#14364F" opacity="0.7" />
      {/* walkway */}
      <path d="M348 300 L330 340 L366 340 Z" fill="#0F2C40" />
      {/* mailbox */}
      <rect x="500" y="266" width="4" height="34" fill="#2C5A78" />
      <rect x="492" y="256" width="22" height="12" rx="4" fill="#2C5A78" />
      {/* time on the sky, like a caption on a photo */}
      <text
        x="40"
        y="368"
        fontFamily="var(--c01-mono), ui-monospace, monospace"
        fontSize="12"
        fill="#9DB4C4"
        letterSpacing="1"
      >
        9:14 PM · 54°F INSIDE
      </text>
    </svg>
  );
}

/* A desk phone. Handset on the cradle, keypad, coiled cord, one LED. */
export function DeskPhone({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="c1-phone-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C4866" />
          <stop offset="1" stopColor="#12344C" />
        </linearGradient>
        <linearGradient id="c1-handset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#153D58" />
          <stop offset="1" stopColor="#0B2A3F" />
        </linearGradient>
      </defs>
      {/* ring waves — pulsed by GSAP in the hero */}
      <g className="c1-rings" fill="none" stroke="#B8C9D6" strokeWidth="2.5">
        <circle className="c1-ring" cx="150" cy="64" r="74" />
        <circle className="c1-ring" cx="150" cy="64" r="74" />
        <circle className="c1-ring" cx="150" cy="64" r="74" />
      </g>
      {/* shadow */}
      <ellipse cx="160" cy="218" rx="140" ry="10" fill="#020D15" opacity="0.5" />
      {/* base */}
      <path
        d="M40 118 h240 a14 14 0 0 1 14 14 v62 a14 14 0 0 1 -14 14 h-240 a14 14 0 0 1 -14 -14 v-62 a14 14 0 0 1 14 -14 z"
        fill="url(#c1-phone-body)"
        stroke="#2C5A78"
        strokeWidth="1.5"
      />
      <path d="M52 118 l12 -22 h192 l12 22 z" fill="#1F4F70" />
      {/* cradle */}
      <rect x="66" y="128" width="98" height="16" rx="6" fill="#0B2A3F" />
      {/* keypad */}
      <g fill="#EAF1F5" opacity="0.9">
        {[0, 1, 2].map((c) =>
          [0, 1, 2, 3].map((r) => (
            <rect
              key={`${c}-${r}`}
              x={192 + c * 26}
              y={132 + r * 16}
              width="20"
              height="11"
              rx="2.5"
            />
          )),
        )}
      </g>
      {/* LED */}
      <circle className="c1-led" cx="80" cy="176" r="4" fill="#9DB4C4" />
      <text
        x="92"
        y="180"
        fontFamily="var(--c01-sans), system-ui, sans-serif"
        fontSize="9"
        fill="#9DB4C4"
        letterSpacing="1"
      >
        LINE 1
      </text>
      {/* handset */}
      <g className="c1-handset">
        <path
          d="M58 112 C 58 34, 232 34, 232 112"
          stroke="url(#c1-handset)"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="58" cy="114" rx="20" ry="13" fill="#0B2A3F" />
        <ellipse cx="232" cy="114" rx="20" ry="13" fill="#0B2A3F" />
        <ellipse cx="58" cy="114" rx="11" ry="6" fill="#153D58" />
        <ellipse cx="232" cy="114" rx="11" ry="6" fill="#153D58" />
      </g>
      {/* coiled cord */}
      <path
        d="M40 150 q-10 6 0 12 q10 6 0 12 q-10 6 0 12 q10 6 0 12 q-10 6 0 12"
        stroke="#9DB4C4"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

/* A service van at dawn. The morning after — the job that got booked. */
export function VanDawn({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 640 360"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="c1-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B2A3F" />
          <stop offset="0.45" stopColor="#2F5878" />
          <stop offset="0.8" stopColor="#9DB4C4" />
          <stop offset="1" stopColor="#DCE7EE" />
        </linearGradient>
        <linearGradient id="c1-van-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A6E9C" />
          <stop offset="1" stopColor="#1E5F8C" />
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill="url(#c1-dawn)" />
      {/* sun, just up */}
      <circle cx="500" cy="248" r="44" fill="#F3E3BC" opacity="0.9" />
      {/* hills */}
      <path d="M0 262 Q120 220 260 256 T640 250 L640 300 L0 300 Z" fill="#1B4560" />
      <path d="M0 280 Q160 250 320 276 T640 272 L640 300 L0 300 Z" fill="#14364F" />
      {/* road */}
      <rect x="0" y="292" width="640" height="68" fill="#0E2B3E" />
      <g stroke="#9DB4C4" strokeWidth="3" strokeDasharray="26 22" opacity="0.5">
        <path d="M0 330 L640 330" />
      </g>
      {/* van shadow */}
      <ellipse cx="330" cy="304" rx="210" ry="12" fill="#061826" opacity="0.6" />
      {/* ladder rack */}
      <g stroke="#DCE7EE" strokeWidth="4" strokeLinecap="round">
        <path d="M190 150 L470 150" />
        <path d="M212 150 L212 164" />
        <path d="M450 150 L450 164" />
        <path d="M200 142 L440 142" opacity="0.7" />
      </g>
      {/* body */}
      <path
        d="M150 164 h300 a16 16 0 0 1 16 16 v14 l40 20 v50 a12 12 0 0 1 -12 12 h-360 a12 12 0 0 1 -12 -12 v-84 a16 16 0 0 1 16 -16 z"
        fill="url(#c1-van-body)"
      />
      {/* windshield */}
      <path d="M452 176 h12 l36 22 v20 h-48 z" fill="#DCE7EE" opacity="0.92" />
      {/* side window */}
      <rect x="392" y="176" width="46" height="34" rx="4" fill="#DCE7EE" opacity="0.92" />
      {/* sliding door line */}
      <path d="M380 166 L380 276" stroke="#12344C" strokeWidth="3" />
      {/* panel */}
      <rect x="166" y="194" width="196" height="46" rx="4" fill="#EAF1F5" />
      <text
        x="264"
        y="214"
        textAnchor="middle"
        fontFamily="var(--c01-sans), system-ui, sans-serif"
        fontWeight="700"
        fontSize="15"
        fill="#0B2A3F"
        letterSpacing="1.5"
      >
        YOUR SHOP
      </text>
      <text
        x="264"
        y="230"
        textAnchor="middle"
        fontFamily="var(--c01-sans), system-ui, sans-serif"
        fontSize="10"
        fill="#4F6472"
        letterSpacing="2"
      >
        HEATING · COOLING
      </text>
      {/* bumper + lights */}
      <rect x="500" y="262" width="10" height="14" rx="2" fill="#F3E3BC" />
      <rect x="132" y="262" width="10" height="14" rx="2" fill="#C0392B" opacity="0.9" />
      <rect x="134" y="276" width="376" height="8" rx="3" fill="#0B2A3F" />
      {/* wheels */}
      <g>
        <circle cx="210" cy="280" r="26" fill="#0E1F2D" />
        <circle cx="210" cy="280" r="12" fill="#4F6472" />
        <circle cx="210" cy="280" r="4" fill="#DCE7EE" />
        <circle cx="440" cy="280" r="26" fill="#0E1F2D" />
        <circle cx="440" cy="280" r="12" fill="#4F6472" />
        <circle cx="440" cy="280" r="4" fill="#DCE7EE" />
      </g>
      <text
        x="40"
        y="48"
        fontFamily="var(--c01-mono), ui-monospace, monospace"
        fontSize="12"
        fill="#DCE7EE"
        letterSpacing="1"
        opacity="0.85"
      >
        7:30 AM · FIRST STOP, QUINCY
      </text>
    </svg>
  );
}

/* A written estimate on the desk, three weeks old. */
export function QuoteSheet({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="164" cy="222" rx="120" ry="8" fill="#0E1F2D" opacity="0.12" />
      <g transform="rotate(-4 160 120)">
        <rect x="70" y="24" width="190" height="200" rx="4" fill="#FFFFFF" stroke="#D3DFE8" />
        <rect x="70" y="24" width="190" height="26" rx="4" fill="#F2F7FA" />
        <rect x="84" y="34" width="70" height="7" rx="2" fill="#4F6472" opacity="0.7" />
        <rect x="200" y="34" width="46" height="7" rx="2" fill="#9DB4C4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x="84" y={66 + i * 20} width={110 - (i % 3) * 14} height="6" rx="2" fill="#D3DFE8" />
            <rect x="214" y={66 + i * 20} width="32" height="6" rx="2" fill="#D3DFE8" />
          </g>
        ))}
        <path d="M84 176 L246 176" stroke="#D3DFE8" strokeWidth="1.5" />
        <rect x="84" y="186" width="48" height="8" rx="2" fill="#0E1F2D" opacity="0.7" />
        <rect x="196" y="184" width="50" height="12" rx="2" fill="#0E1F2D" opacity="0.85" />
        {/* signature line, unsigned */}
        <path d="M84 210 L170 210" stroke="#9DB4C4" strokeWidth="1" strokeDasharray="3 3" />
      </g>
      {/* coffee ring */}
      <circle cx="232" cy="62" r="22" fill="none" stroke="#B8A582" strokeWidth="3" opacity="0.35" />
      <circle cx="232" cy="62" r="18" fill="none" stroke="#B8A582" strokeWidth="1" opacity="0.25" />
      {/* paperclip */}
      <path
        d="M96 20 v30 a8 8 0 0 0 16 0 v-38 a5 5 0 0 0 -10 0 v34"
        stroke="#4F6472"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        transform="rotate(-4 160 120)"
      />
      <text
        x="76"
        y="230"
        fontFamily="var(--c01-mono), ui-monospace, monospace"
        fontSize="11"
        fill="#4F6472"
        letterSpacing="1"
      >
        SENT 21 DAYS AGO · NO REPLY
      </text>
    </svg>
  );
}
