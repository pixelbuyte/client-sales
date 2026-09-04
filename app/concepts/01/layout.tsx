import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./concept.css";

// Concept 01 — "Night Shift". Fonts are scoped to this route so nothing
// else on the site pays for them.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--c01-serif",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--c01-sans",
  display: "swap",
});

// Timestamps and ticket numbers only. Never body copy.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--c01-mono",
  display: "swap",
});

export default function Concept01Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`c01 ${serif.variable} ${sans.variable} ${mono.variable}`}>{children}</div>
  );
}
