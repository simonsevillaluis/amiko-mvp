import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amiko: {
          blue: "#0F5AD1",
          navy: "#09367C",
          green: "#8EC733",
          mint: "#ECF6D0",
          sky: "#EAF0FD",
          cream: "#FFF8E8",
          coral: "#FF8A7A",
          ink: "#17202E",
          muted: "#64748B",
        },
      },
      boxShadow: {
        soft: "0 16px 36px rgba(20, 52, 92, 0.12)",
        card: "0 8px 22px rgba(20, 52, 92, 0.10)",
      },
      keyframes: {
        celebratePop: {
          "0%":   { transform: "scale(0.3)", opacity: "0" },
          "60%":  { transform: "scale(1.18)" },
          "80%":  { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        sparkle: {
          "0%":   { transform: "scale(0) rotate(0deg)",    opacity: "0" },
          "40%":  { transform: "scale(1.2) rotate(160deg)", opacity: "0.8" },
          "100%": { transform: "scale(0) rotate(320deg)",  opacity: "0" },
        },
        slideUpFade: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
      },
      animation: {
        "celebrate-pop": "celebratePop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "sparkle":       "sparkle 1.8s ease-in-out infinite",
        "slide-up":      "slideUpFade 0.45s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
