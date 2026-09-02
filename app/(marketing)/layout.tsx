import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";

// Marketing-only typefaces. Declared here rather than in the root layout so
// the tracker and pay pages don't pay to download them.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

// Used sparingly — timestamps and ticket numbers only. Never for body copy:
// wall-to-wall monospace makes a service business read as a machine.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-code",
  display: "swap",
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`marketing-root ${dmSans.variable} ${instrument.variable} ${jetbrains.variable} min-h-screen font-grotesk text-sand-ink antialiased`}
    >
      {children}
    </div>
  );
}
