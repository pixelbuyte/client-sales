import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FBF8F3",
        surface: "#FFFFFF",
        ink: "#18120A",
        muted: "#8B7355",
        border: "#E8DDD0",
        accent: "#D4451A",
        "accent-50": "#FEF3EF",
        "accent-200": "#F5A58A",
        success: "#1A6B3A",
        "success-50": "#EEF7F2",
        warning: "#C4820F",
        "warning-50": "#FEF8EC",
        sidebar: "#F5EDE0",

        // Marketing surface — ocean palette. See design/COLOR-RESEARCH.md for
        // the reasoning: blue earns trust, green marks money coming back, and
        // one orange is reserved for the CTA. Kept separate from the app
        // tokens above so the tracker/pay pages are untouched.
        ocean: {
          DEFAULT: "#0B2A3F",
          deep: "#071E2E",
          mid: "#123A55",
          line: "rgba(255,255,255,0.12)",
          muted: "#9DB4C4",
        },
        sea: {
          bg: "#EAF1F5",
          surface: "#FFFFFF",
          raised: "#F2F7FA",
          line: "#D3DFE8",
          ink: "#0E1F2D",
          muted: "#4F6472",
        },
        trust: {
          DEFAULT: "#1E5F8C",
          hover: "#174B70",
          soft: "#E1EDF6",
        },
        cta: {
          DEFAULT: "#F08A24",
          hover: "#D9771A",
          soft: "#FDEBD7",
        },
        stamp: {
          booked: "#1F8A5B",
          "booked-bg": "#E4F4EC",
          missed: "#C0392B",
          "missed-bg": "#FBE7E4",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        // Marketing pages
        serif: ["var(--font-editorial)", "Georgia", "serif"],
        grotesk: ["var(--font-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        code: ["var(--font-code)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "6px", // app/tracker
        ticket: "14px", // marketing
      },
      boxShadow: {
        card: "0 1px 3px rgba(24,18,10,.07), 0 1px 2px rgba(24,18,10,.04)",
        "card-hover":
          "0 4px 16px rgba(24,18,10,.10), 0 2px 4px rgba(24,18,10,.06)",
        ticket: "0 1px 2px rgba(27,23,18,0.05), 0 2px 6px rgba(27,23,18,0.06)",
        lift: "0 8px 24px rgba(27,23,18,0.10), 0 2px 6px rgba(27,23,18,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
