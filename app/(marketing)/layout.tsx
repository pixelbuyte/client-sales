import { Archivo, Archivo_Black, JetBrains_Mono } from "next/font/google";

// Marketing-only typefaces. Declared here rather than in the root layout so
// the tracker and pay pages don't pay to download them.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-industrial",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-code",
  display: "swap",
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`marketing-root ${archivo.variable} ${archivoBlack.variable} ${jetbrains.variable} min-h-screen bg-night-bg font-grotesk text-night-ink antialiased`}
    >
      {children}
    </div>
  );
}
