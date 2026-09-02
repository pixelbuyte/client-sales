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

        // Marketing surface — warm, textured, paper-like. Kept separate from
        // the app tokens above so the tracker/pay pages are untouched.
        sand: {
          bg: "#F3EAD9",
          surface: "#FFFDF8",
          raised: "#FAF4E8",
          line: "#E6DDCC",
          ink: "#1B1712",
          muted: "#6E675C",
        },
        clay: {
          DEFAULT: "#B4472C",
          hover: "#98371F",
          soft: "#F6E5DE",
        },
        stamp: {
          booked: "#4F7A45",
          "booked-bg": "#EDF2E0",
          missed: "#B22B2B",
          "missed-bg": "#FBE9E6",
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
