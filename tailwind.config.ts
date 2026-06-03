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
    },
  },
  plugins: [],
};

export default config;
