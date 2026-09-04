// Inline SVG illustrations for the Dispatch Board concept. All decorative,
// all aria-hidden. The clock exposes data-hand attributes so the client
// components can sweep its hands with GSAP.

export function WallClock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="c03-clock-face" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6e1d4" />
        </radialGradient>
        <linearGradient id="c03-clock-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b4a58" />
          <stop offset="1" stopColor="#141c24" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#c03-clock-rim)" />
      <circle cx="100" cy="100" r="88" fill="url(#c03-clock-face)" />
      <g stroke="#1b2733" strokeLinecap="round">
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const big = i % 5 === 0;
          const r1 = big ? 72 : 79;
          const r2 = 84;
          // Rounded so the server and client render identical attribute strings.
          const f = (n: number) => Math.round(n * 100) / 100;
          return (
            <line
              key={i}
              x1={f(100 + Math.sin(a) * r1)}
              y1={f(100 - Math.cos(a) * r1)}
              x2={f(100 + Math.sin(a) * r2)}
              y2={f(100 - Math.cos(a) * r2)}
              strokeWidth={big ? 4 : 1.5}
              opacity={big ? 1 : 0.5}
            />
          );
        })}
      </g>
      <g fill="#1b2733" fontFamily="var(--disp)" fontWeight="800" fontSize="22" textAnchor="middle">
        <text x="100" y="46">12</text>
        <text x="158" y="108">3</text>
        <text x="100" y="168">6</text>
        <text x="42" y="108">9</text>
      </g>
      {/* hour hand: 9:14 is 277deg; starts at 5:00 (150deg) and sweeps */}
      <g data-hand="hour" style={{ transform: "rotate(277deg)", transformOrigin: "100px 100px" }}>
        <rect x="95" y="52" width="10" height="58" rx="5" fill="#1b2733" />
      </g>
      {/* minute hand: 14 min = 84deg */}
      <g data-hand="minute" style={{ transform: "rotate(84deg)", transformOrigin: "100px 100px" }}>
        <rect x="96.5" y="30" width="7" height="80" rx="3.5" fill="#1b2733" />
      </g>
      <g data-hand="second" style={{ transform: "rotate(190deg)", transformOrigin: "100px 100px" }}>
        <rect x="99" y="24" width="2" height="94" rx="1" fill="#c0392b" />
      </g>
      <circle cx="100" cy="100" r="6" fill="#c0392b" />
      <circle cx="100" cy="100" r="2.5" fill="#fff" />
    </svg>
  );
}

export function Van({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 120" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="130" cy="112" rx="118" ry="6" fill="rgba(0,0,0,0.18)" />
      <path
        d="M14 92 V44 a10 10 0 0 1 10 -10 h122 l38 8 l32 22 l26 4 a8 8 0 0 1 6 8 v16 a6 6 0 0 1 -6 6 H14 z"
        fill="#12385a"
      />
      <path d="M14 66 h232" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M150 42 l32 6 l26 18 h-58 z" fill="#d8e6f2" />
      <path d="M26 42 h118 v22 H26 z" fill="#fbfaf6" />
      <text
        x="85"
        y="58"
        textAnchor="middle"
        fontFamily="var(--disp)"
        fontWeight="800"
        fontSize="12"
        fill="#12385a"
      >
        YOUR HVAC CO.
      </text>
      <text x="85" y="82" textAnchor="middle" fontFamily="var(--sans)" fontWeight="700" fontSize="7" fill="#ffd98a" letterSpacing="1">
        HEATING · COOLING · 24 HR
      </text>
      <rect x="236" y="74" width="10" height="8" rx="2" fill="#ffd257" />
      <rect x="14" y="76" width="8" height="8" rx="2" fill="#e74c3c" />
      <g>
        <circle cx="62" cy="98" r="16" fill="#1b2733" />
        <circle cx="62" cy="98" r="7" fill="#c9ccd1" />
        <circle cx="196" cy="98" r="16" fill="#1b2733" />
        <circle cx="196" cy="98" r="7" fill="#c9ccd1" />
      </g>
      {/* ladder on the roof */}
      <rect x="40" y="26" width="120" height="4" rx="2" fill="#c9ccd1" />
      <rect x="40" y="18" width="120" height="4" rx="2" fill="#c9ccd1" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={50 + i * 20} y="18" width="3" height="12" fill="#a4a8ae" />
      ))}
    </svg>
  );
}

export function Houses({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 90" className={className} aria-hidden="true" focusable="false">
      {/* three houses, one lit window at 9pm */}
      <g fill="#c3ccd4">
        <path d="M10 88 V48 l30 -24 l30 24 v40 z" />
        <path d="M95 88 V40 l35 -26 l35 26 v48 z" />
        <path d="M185 88 V50 l30 -22 l30 22 v38 z" />
      </g>
      <g fill="#9aa6b1">
        <path d="M6 50 l34 -28 l34 28 l-4 4 l-30 -24 l-30 24 z" />
        <path d="M90 43 l40 -32 l40 32 l-4 4 l-36 -28 l-36 28 z" />
        <path d="M181 52 l34 -26 l34 26 l-4 4 l-30 -22 l-30 22 z" />
      </g>
      <g fill="#6f7b86">
        <rect x="34" y="66" width="12" height="22" />
        <rect x="124" y="60" width="12" height="28" />
        <rect x="209" y="66" width="12" height="22" />
      </g>
      <g fill="#ffd257">
        <rect x="18" y="56" width="10" height="10" rx="1" />
        <rect x="104" y="52" width="10" height="10" rx="1" />
        <rect x="146" y="52" width="10" height="10" rx="1" opacity="0.4" />
        <rect x="236" y="58" width="10" height="10" rx="1" opacity="0.4" />
      </g>
      {/* chimney with no smoke: the furnace is out */}
      <rect x="140" y="18" width="8" height="18" fill="#9aa6b1" />
    </svg>
  );
}

export function Magnet({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="18" fill="#c0392b" />
      <circle cx="20" cy="20" r="18" fill="url(#c03-magnet-shine)" />
      <circle cx="20" cy="20" r="7" fill="#8f2a1f" />
      <circle cx="20" cy="20" r="4" fill="#d9d2c2" />
      <defs>
        <radialGradient id="c03-magnet-shine" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.25" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Tick({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

export function Cross({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

/* A hand-drawn marker X for the "what this isn't" cards. */
export function MarkerX({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <path
        d="M8 9 C 14 14, 22 24, 32 31 M31 8 C 24 15, 16 24, 9 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Scene for leak 01: a phone on the kitchen table at night, a text arriving. */
export function PhoneScene() {
  return (
    <svg viewBox="0 0 520 220" aria-hidden="true" focusable="false">
      <rect width="520" height="220" fill="#0c2a45" />
      <rect x="0" y="150" width="520" height="70" fill="#5a3e2b" />
      <rect x="0" y="150" width="520" height="8" fill="#7a5439" />
      {/* window with night */}
      <rect x="360" y="24" width="120" height="96" rx="6" fill="#071a2c" stroke="#d8d2c2" strokeWidth="6" />
      <line x1="420" y1="24" x2="420" y2="120" stroke="#d8d2c2" strokeWidth="4" />
      <line x1="360" y1="72" x2="480" y2="72" stroke="#d8d2c2" strokeWidth="4" />
      <circle cx="450" cy="50" r="9" fill="#ffe9a8" />
      {/* thermostat on the wall reading 54 */}
      <circle cx="90" cy="70" r="34" fill="#e9e4d8" />
      <circle cx="90" cy="70" r="26" fill="#fbfaf6" stroke="#c9c3b4" strokeWidth="2" />
      <text x="90" y="77" textAnchor="middle" fontFamily="var(--disp)" fontWeight="800" fontSize="20" fill="#c0392b">
        54°
      </text>
      {/* phone on the table */}
      <g transform="translate(210 22) rotate(-8)">
        <rect x="0" y="0" width="92" height="170" rx="14" fill="#1b2733" />
        <rect x="6" y="8" width="80" height="154" rx="10" fill="#fbfaf6" />
        <rect x="14" y="26" width="64" height="30" rx="8" fill="#e4f4ec" />
        <text x="20" y="38" fontFamily="var(--sans)" fontWeight="600" fontSize="8" fill="#1f8a5b">
          Got your call —
        </text>
        <text x="20" y="49" fontFamily="var(--sans)" fontSize="8" fill="#1f8a5b">
          no heat? Reply 1.
        </text>
        <rect x="14" y="64" width="64" height="20" rx="8" fill="#eef2f5" />
        <text x="20" y="77" fontFamily="var(--sans)" fontSize="8" fill="#33414d">
          Pick a window ▸
        </text>
        <rect x="30" y="150" width="32" height="4" rx="2" fill="#1b2733" />
      </g>
      {/* a mug */}
      <rect x="120" y="118" width="34" height="34" rx="5" fill="#c0392b" />
      <path d="M154 126 a10 10 0 0 1 0 20" fill="none" stroke="#c0392b" strokeWidth="5" />
      <text x="24" y="206" fontFamily="var(--hand)" fontSize="22" fill="#ffd98a">
        9:14 pm, Quincy.
      </text>
      <text x="330" y="206" fontFamily="var(--hand)" fontSize="22" fill="#ffd98a">
        Text back in seconds.
      </text>
    </svg>
  );
}

/* Scene for leak 02: an estimate sheet under a magnet on the fridge, going quiet. */
export function EstimateScene() {
  return (
    <svg viewBox="0 0 520 220" aria-hidden="true" focusable="false">
      <rect width="520" height="220" fill="#e6e1d4" />
      {/* fridge door */}
      <rect x="0" y="0" width="520" height="220" fill="#d8d2c2" />
      <rect x="0" y="0" width="520" height="14" fill="#c9c3b4" />
      <rect x="470" y="60" width="10" height="120" rx="5" fill="#b9b3a3" />
      {/* the estimate sheet */}
      <g transform="translate(60 30) rotate(-3)">
        <rect x="0" y="0" width="220" height="180" fill="#fbfaf6" stroke="#ddd6c6" />
        <text x="16" y="28" fontFamily="var(--disp)" fontWeight="800" fontSize="13" fill="#12385a" letterSpacing="1">
          ESTIMATE #4471
        </text>
        <text x="16" y="48" fontFamily="var(--sans)" fontSize="10" fill="#33414d">
          Replace furnace + coil · Milton
        </text>
        <line x1="16" y1="62" x2="204" y2="62" stroke="#ddd6c6" />
        <text x="16" y="82" fontFamily="var(--sans)" fontSize="10" fill="#5a6873">
          96% two-stage, 80k BTU
        </text>
        <text x="16" y="100" fontFamily="var(--sans)" fontSize="10" fill="#5a6873">
          Haul-away, permit, startup
        </text>
        <text x="16" y="118" fontFamily="var(--sans)" fontSize="10" fill="#5a6873">
          10-yr parts
        </text>
        <line x1="16" y1="134" x2="204" y2="134" stroke="#ddd6c6" />
        <text x="16" y="158" fontFamily="var(--disp)" fontWeight="800" fontSize="18" fill="#14202b">
          $ ______
        </text>
        <text x="130" y="158" fontFamily="var(--sans)" fontSize="9" fill="#5a6873">
          valid 30 days
        </text>
      </g>
      {/* magnet */}
      <circle cx="170" cy="34" r="14" fill="#c0392b" />
      <circle cx="170" cy="34" r="5" fill="#8f2a1f" />
      {/* calendar with days crossed */}
      <g transform="translate(330 40)">
        <rect x="0" y="0" width="140" height="120" rx="6" fill="#fbfaf6" stroke="#ddd6c6" />
        <rect x="0" y="0" width="140" height="24" rx="6" fill="#12385a" />
        <text x="70" y="16" textAnchor="middle" fontFamily="var(--disp)" fontWeight="700" fontSize="11" fill="#fff" letterSpacing="1">
          THREE WEEKS
        </text>
        {Array.from({ length: 21 }).map((_, i) => {
          const x = 10 + (i % 7) * 18;
          const y = 36 + Math.floor(i / 7) * 26;
          return (
            <g key={i}>
              <rect x={x} y={y} width="14" height="18" rx="2" fill="#eef2f5" />
              {i < 19 ? (
                <path
                  d={`M${x + 2} ${y + 3} l10 12 M${x + 12} ${y + 3} l-10 12`}
                  stroke="#c0392b"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : null}
            </g>
          );
        })}
      </g>
      <text x="330" y="190" fontFamily="var(--hand)" fontSize="22" fill="#12385a">
        no yes, no no — just quiet
      </text>
    </svg>
  );
}
