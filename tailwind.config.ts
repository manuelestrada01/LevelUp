import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./dashboard/**/*.{js,ts,jsx,tsx,mdx}",
    "./xp/**/*.{js,ts,jsx,tsx,mdx}",
    "./strikes/**/*.{js,ts,jsx,tsx,mdx}",
    "./clases-formativas/**/*.{js,ts,jsx,tsx,mdx}",
    "./talentos/**/*.{js,ts,jsx,tsx,mdx}",
    "./distinciones/**/*.{js,ts,jsx,tsx,mdx}",
    "./laminas/**/*.{js,ts,jsx,tsx,mdx}",
    "./misiones/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0d1a0f",
          900: "#1a2e1c",
          800: "#1e3320",
        },
        amber: {
          gold: "#c9a227",
        },
        sage: "#8fbc8f",
        cream: "#f5f0e8",
        muted: "#9aab8a",
        danger: "#c0392b",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;