// Geometric, two-tone SVG illustrations. No image assets exist in this repo,
// so everything here is drawn from simple shapes. Both hero scenes share
// identical geometry so the before/after wipe reveals the same house, the
// same clock, the same phone — only the lighting and the outcome change.

type Variant = "before" | "after";

// Round so server and client serialize the same string (hydration).
const r2 = (n: number) => Math.round(n * 100) / 100;

export function Check({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
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

export function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}

/* ------------------------------------------------------------ scene ---- */

function clockHands(variant: Variant) {
  // 9:14 pm vs 7:30 am. Angles measured clockwise from 12.
  const [h, m] = variant === "before" ? [9, 14] : [7, 30];
  const hourA = ((h % 12) + m / 60) * 30;
  const minA = m * 6;
  const pt = (angle: number, r: number) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return [r2(Math.cos(a) * r), r2(Math.sin(a) * r)] as const;
  };
  const [hx, hy] = pt(hourA, 22);
  const [mx, my] = pt(minA, 32);
  return { hx, hy, mx, my };
}

export function Scene({ variant }: { variant: Variant }) {
  const dark = variant === "before";
  const ink = dark ? "#F4F1EA" : "#0B2A3F";
  const fill = dark ? "#123A55" : "#EBE6DB";
  const fill2 = dark ? "#0B2A3F" : "#F4F1EA";
  const dim = dark ? "rgba(244,241,234,0.35)" : "rgba(11,42,63,0.35)";
  const { hx, hy, mx, my } = clockHands(variant);

  return (
    <svg
      className="c04-scene"
      viewBox="0 0 640 320"
      role="img"
      aria-label={
        dark
          ? "A house in Quincy at 9:14 pm with the heat out. The phone is ringing and nobody is picking up."
          : "The same house at 7:30 am. The van is outside and the job is on the board."
      }
    >
      {/* sky objects */}
      {dark ? (
        <g>
          <circle cx="560" cy="58" r="26" fill={ink} opacity="0.9" />
          <circle cx="572" cy="48" r="24" fill="#0f3650" />
          {[
            [40, 30],
            [120, 70],
            [200, 22],
            [300, 60],
            [420, 26],
            [480, 90],
            [610, 130],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill={ink} opacity="0.7" />
          ))}
        </g>
      ) : (
        <g>
          <circle cx="560" cy="62" r="30" fill="#F08A24" opacity="0.9" />
          <circle cx="560" cy="62" r="42" fill="none" stroke="#F08A24" strokeOpacity="0.35" strokeWidth="2" />
        </g>
      )}

      {/* ground */}
      <line x1="0" y1="262" x2="640" y2="262" stroke={ink} strokeOpacity="0.5" strokeWidth="2" />
      <line x1="0" y1="290" x2="640" y2="290" stroke={ink} strokeOpacity="0.12" strokeWidth="1" />

      {/* clock */}
      <g transform="translate(92 120)">
        <circle r="54" fill={fill2} stroke={ink} strokeWidth="3" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          const r1 = i % 3 === 0 ? 40 : 45;
          return (
            <line
              key={i}
              x1={r2(Math.cos(a) * r1)}
              y1={r2(Math.sin(a) * r1)}
              x2={r2(Math.cos(a) * 48)}
              y2={r2(Math.sin(a) * 48)}
              stroke={ink}
              strokeWidth={i % 3 === 0 ? 3 : 1.5}
              strokeLinecap="round"
            />
          );
        })}
        <line x1="0" y1="0" x2={hx} y2={hy} stroke={ink} strokeWidth="5" strokeLinecap="round" />
        <line x1="0" y1="0" x2={mx} y2={my} stroke={dark ? "#ff8a7a" : "#1F8A5B"} strokeWidth="3" strokeLinecap="round" />
        <circle r="4" fill={ink} />
        <text
          x="0"
          y="82"
          textAnchor="middle"
          fontFamily="var(--display)"
          fontWeight="800"
          fontSize="18"
          fill={ink}
          letterSpacing="0.04em"
        >
          {dark ? "9:14 PM" : "7:30 AM"}
        </text>
      </g>

      {/* house */}
      <g>
        <polygon points="196,148 318,62 440,148" fill={fill} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <rect x="214" y="148" width="208" height="114" fill={fill2} stroke={ink} strokeWidth="3" />
        <rect x="372" y="80" width="22" height="40" fill={fill} stroke={ink} strokeWidth="3" />
        {/* door */}
        <rect x="300" y="196" width="40" height="66" fill={fill} stroke={ink} strokeWidth="3" />
        <circle cx="332" cy="232" r="2.5" fill={ink} />
        {/* windows */}
        <rect x="236" y="170" width="44" height="40" fill={dark ? "#0B2A3F" : "#FDE6C8"} stroke={ink} strokeWidth="3" />
        <line x1="258" y1="170" x2="258" y2="210" stroke={ink} strokeWidth="2" />
        <line x1="236" y1="190" x2="280" y2="190" stroke={ink} strokeWidth="2" />
        <rect x="360" y="170" width="44" height="40" fill={dark ? "#0B2A3F" : "#FDE6C8"} stroke={ink} strokeWidth="3" />
        <line x1="382" y1="170" x2="382" y2="210" stroke={ink} strokeWidth="2" />
        <line x1="360" y1="190" x2="404" y2="190" stroke={ink} strokeWidth="2" />
        {/* thermometer tag */}
        <g transform="translate(318 112)">
          <rect x="-40" y="-14" width="80" height="28" rx="14" fill={dark ? "#C0392B" : "#1F8A5B"} />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fontFamily="var(--display)"
            fontWeight="800"
            fontSize="15"
            fill="#FFFFFF"
            letterSpacing="0.02em"
          >
            {dark ? "54°F" : "68°F"}
          </text>
        </g>
        {/* chimney smoke only when heat is on */}
        {!dark ? (
          <g fill="none" stroke={ink} strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round">
            <path d="M383 70c-6-8 6-14 0-22" />
            <path d="M383 44c-6-8 6-14 0-22" opacity="0.5" />
          </g>
        ) : null}
      </g>

      {/* van (after only) */}
      {!dark ? (
        <g>
          <rect x="452" y="196" width="150" height="58" rx="6" fill={fill} stroke={ink} strokeWidth="3" />
          <path d="M452 254v-30l18-28h56v58z" fill={fill2} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
          <rect x="478" y="204" width="34" height="20" fill="#FDE6C8" stroke={ink} strokeWidth="2.5" />
          <line x1="530" y1="214" x2="590" y2="214" stroke={ink} strokeOpacity="0.4" strokeWidth="2" />
          <line x1="530" y1="228" x2="590" y2="228" stroke={ink} strokeOpacity="0.4" strokeWidth="2" />
          <circle cx="486" cy="258" r="12" fill={fill2} stroke={ink} strokeWidth="3" />
          <circle cx="572" cy="258" r="12" fill={fill2} stroke={ink} strokeWidth="3" />
          <circle cx="486" cy="258" r="4" fill={ink} />
          <circle cx="572" cy="258" r="4" fill={ink} />
        </g>
      ) : (
        <g>
          {/* empty driveway marker */}
          <line x1="452" y1="262" x2="602" y2="262" stroke={ink} strokeOpacity="0.5" strokeWidth="2" strokeDasharray="6 6" />
          <text
            x="527"
            y="246"
            textAnchor="middle"
            fontFamily="var(--display)"
            fontWeight="700"
            fontSize="12"
            fill={ink}
            opacity="0.5"
            letterSpacing="0.14em"
          >
            NO TRUCK
          </text>
        </g>
      )}

      {/* phone */}
      <g transform="translate(150 190)">
        {dark ? (
          <g fill="none" stroke="#ff8a7a" strokeWidth="2.5">
            <circle r="46" opacity="0.55" />
            <circle r="62" opacity="0.3" />
            <circle r="78" opacity="0.14" />
          </g>
        ) : (
          <g>
            <circle r="46" fill="none" stroke="#1F8A5B" strokeOpacity="0.25" strokeWidth="2.5" />
          </g>
        )}
        <rect x="-20" y="-40" width="40" height="76" rx="8" fill={fill2} stroke={ink} strokeWidth="3" />
        <rect x="-14" y="-32" width="28" height="52" rx="3" fill={dark ? "#0f3650" : "#FDE6C8"} />
        <circle cy="29" r="3" fill={ink} />
        {dark ? (
          <g stroke="#ff8a7a" strokeWidth="3" strokeLinecap="round">
            <line x1="-6" y1="-14" x2="6" y2="-2" />
            <line x1="6" y1="-14" x2="-6" y2="-2" />
          </g>
        ) : (
          <path d="M-7-8l5 5 9-10" fill="none" stroke="#1F8A5B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </g>

      {/* caption chip */}
      <g transform={dark ? "translate(150 292)" : "translate(150 292)"}>
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontFamily="var(--display)"
          fontWeight="700"
          fontSize="12"
          fill={dim}
          letterSpacing="0.14em"
        >
          {dark ? "RINGING · NO ANSWER" : "TEXT BACK · 4 SEC"}
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------ panel art ------ */

// Leak 01: a phone ringing out at night, big and geometric.
export function PhoneArt() {
  return (
    <svg viewBox="0 0 420 420" aria-hidden="true">
      <g fill="none" stroke="#ff8a7a" strokeWidth="2">
        <circle cx="210" cy="210" r="120" opacity="0.5" />
        <circle cx="210" cy="210" r="160" opacity="0.28" />
        <circle cx="210" cy="210" r="200" opacity="0.12" />
      </g>
      <rect x="150" y="100" width="120" height="220" rx="20" fill="#0B2A3F" stroke="#F4F1EA" strokeWidth="4" />
      <rect x="164" y="122" width="92" height="160" rx="6" fill="#123A55" />
      <circle cx="210" cy="302" r="7" fill="#F4F1EA" />
      <g transform="translate(210 200)">
        <circle r="34" fill="#C0392B" />
        <path d="M-12-12l24 24M12-12l-24 24" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      </g>
      <text x="210" y="160" textAnchor="middle" fontFamily="var(--display)" fontWeight="800" fontSize="14" fill="#F4F1EA" letterSpacing="0.14em" opacity="0.8">
        9:14 PM
      </text>
      <text x="210" y="262" textAnchor="middle" fontFamily="var(--display)" fontWeight="700" fontSize="11" fill="#F4F1EA" letterSpacing="0.14em" opacity="0.6">
        MISSED CALL
      </text>
    </svg>
  );
}

// Leak 02: a written estimate, sitting there.
export function QuoteArt() {
  const rows = [56, 80, 104, 128];
  return (
    <svg viewBox="0 0 420 420" aria-hidden="true">
      <rect x="70" y="60" width="280" height="300" rx="6" fill="#FFFDF8" stroke="#0B2A3F" strokeWidth="3" transform="rotate(-3 210 210)" />
      <g transform="rotate(-3 210 210)">
        <rect x="94" y="84" width="120" height="14" rx="2" fill="#0B2A3F" />
        <rect x="94" y="108" width="72" height="8" rx="2" fill="#0B2A3F" opacity="0.4" />
        {rows.map((y) => (
          <g key={y}>
            <rect x="94" y={y + 92} width="150" height="8" rx="2" fill="#0B2A3F" opacity="0.28" />
            <rect x="270" y={y + 92} width="56" height="8" rx="2" fill="#0B2A3F" opacity="0.5" />
          </g>
        ))}
        <line x1="94" y1="252" x2="326" y2="252" stroke="#0B2A3F" strokeWidth="2" />
        <text x="94" y="286" fontFamily="var(--display)" fontWeight="900" fontSize="30" fill="#0B2A3F" letterSpacing="-0.03em">
          $9,400
        </text>
        <text x="94" y="308" fontFamily="var(--display)" fontWeight="700" fontSize="11" fill="#0B2A3F" opacity="0.55" letterSpacing="0.14em">
          SYSTEM REPLACEMENT · MILTON
        </text>
      </g>
      <g transform="translate(300 96) rotate(9)">
        <rect x="-64" y="-22" width="128" height="44" rx="6" fill="#F9E3DF" stroke="#C0392B" strokeWidth="3" />
        <text x="0" y="6" textAnchor="middle" fontFamily="var(--display)" fontWeight="900" fontSize="16" fill="#C0392B" letterSpacing="0.14em">
          DAY 9 · QUIET
        </text>
      </g>
      <g transform="translate(120 340) rotate(-6)">
        <rect x="-70" y="-22" width="140" height="44" rx="6" fill="#DFF1E7" stroke="#1F8A5B" strokeWidth="3" />
        <text x="0" y="6" textAnchor="middle" fontFamily="var(--display)" fontWeight="900" fontSize="15" fill="#1F8A5B" letterSpacing="0.12em">
          CHECK-IN · DAY 3
        </text>
      </g>
    </svg>
  );
}
