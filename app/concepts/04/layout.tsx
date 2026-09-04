import { Archivo, Public_Sans } from "next/font/google";
import "./concept.css";

// Concept 04 — "Before / After". Swiss-grotesk set: Archivo at the heavy end
// for display, Public Sans for body. Scoped to this route only.
const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--c04-display",
  display: "swap",
});

const body = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--c04-body",
  display: "swap",
});

export default function Concept04Layout({ children }: { children: React.ReactNode }) {
  return <div className={`c04 ${display.variable} ${body.variable}`}>{children}</div>;
}
