import { Bricolage_Grotesque, Caveat } from "next/font/google";
import "./concept.css";

// Concept 03 — "Dispatch Board". Big grotesque headlines and a marker hand
// for the annotations. DM Sans body comes from the root layout (--font-sans).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-c03-display",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-c03-hand",
  display: "swap",
});

export default function Concept03Layout({ children }: { children: React.ReactNode }) {
  return <div className={`c03 ${bricolage.variable} ${caveat.variable}`}>{children}</div>;
}
