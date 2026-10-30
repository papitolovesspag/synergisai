import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          DEFAULT: "#0A0A0A",
          950: "#0A0A0A",
          900: "#121214",
          850: "#18181B",
          800: "#27272A",
          700: "#3F3F46",
          600: "#52525B",
        },
        chalk: {
          DEFAULT: "#F8F9FA",
          50: "#FFFFFF",
          100: "#F8F9FA",
          200: "#F1F3F5",
          300: "#E4E4E7",
          400: "#D4D4D8",
        },
        industrial: {
          pitch: "#0A0A0A",
          card: "#121214",
          elevated: "#1A1A1E",
          hairline: "#27272A",
          border: "#3F3F46",
          chalk: "#F8F9FA",
          steel: "#E4E4E7",
        },
        safety: {
          orange: "#FF5F15",
          orangeDark: "#EA580C",
          orangeLight: "#FF7A3D",
          orangeGlow: "rgba(255, 95, 21, 0.25)",
        },
        telemetry: {
          green: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-jetbrains-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      backgroundImage: {
        "grid-pattern-dark":
          "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        "grid-pattern-light":
          "radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
