import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: "#18667D",
        navy: "#111555",
      },
      fontFamily: {
        script: ["var(--font-marck-script)", "cursive"],
        accent: ["var(--font-la-belle-aurore)", "cursive"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
