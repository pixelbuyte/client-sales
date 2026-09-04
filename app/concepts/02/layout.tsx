import { Fraunces } from "next/font/google";
import "./concept.css";

// Concept 02 loads its own Fraunces so the italic and the soft/optical axes
// are available. DM Sans comes from the root layout (--font-sans).
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--font-c02-display",
  display: "swap",
});

export default function Concept02Layout({ children }: { children: React.ReactNode }) {
  return <div className={`c02 ${fraunces.variable}`}>{children}</div>;
}
