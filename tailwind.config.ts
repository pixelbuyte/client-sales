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
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { card: "6px" },
      boxShadow: {
        card: "0 1px 3px rgba(24,18,10,.07), 0 1px 2px rgba(24,18,10,.04)",
        "card-hover":
          "0 4px 16px rgba(24,18,10,.10), 0 2px 4px rgba(24,18,10,.06)",
      },
    },
  },
  plugins: [],
};
export default config;
