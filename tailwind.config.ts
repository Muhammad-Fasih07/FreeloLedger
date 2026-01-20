import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#0B63FF',
          light: '#0B63FF',
          dark: '#0B63FF',
        },
        secondary: {
          DEFAULT: '#22C55E',
          light: '#22C55E',
          dark: '#22C55E',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#F59E0B',
          dark: '#F59E0B',
        },
        // Theme-aware colors
        bg: {
          light: '#F8FAFC',
          dark: '#0B1220',
        },
        card: {
          light: '#FFFFFF',
          dark: '#121A2A',
        },
        text: {
          light: '#0F172A',
          dark: '#E5E7EB',
        },
        // Legacy support
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
