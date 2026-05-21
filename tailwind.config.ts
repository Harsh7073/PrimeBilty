import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Dark backgrounds
        dark: {
          950: "#020409",
          900: "#050810",
          850: "#080d18",
          800: "#0d1117",
          750: "#0f1623",
          700: "#111827",
          600: "#1a2332",
          500: "#1f2d3d",
          400: "#243447",
        },
        // Neon accents
        neon: {
          blue:   "#38bdf8",
          purple: "#a78bfa",
          cyan:   "#06b6d4",
          green:  "#10b981",
          pink:   "#f472b6",
        },
        // Surface / glass
        surface: {
          DEFAULT: "rgba(255,255,255,0.04)",
          hover:   "rgba(255,255,255,0.07)",
          border:  "rgba(255,255,255,0.08)",
          strong:  "rgba(255,255,255,0.12)",
        },
      },
      backgroundImage: {
        "gradient-brand":    "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
        "gradient-neon":     "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
        "gradient-dark":     "linear-gradient(180deg, #050810 0%, #0d1117 100%)",
        "gradient-card":     "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        "gradient-glow-blue": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.3) 0%, transparent 60%)",
        "gradient-glow-purple": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.3) 0%, transparent 60%)",
      },
      boxShadow: {
        "glow-blue":   "0 0 30px rgba(59, 130, 246, 0.3)",
        "glow-purple": "0 0 30px rgba(139, 92, 246, 0.3)",
        "glow-cyan":   "0 0 30px rgba(6, 182, 212, 0.3)",
        "card":        "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)",
        "card-hover":  "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
        "inner-glow":  "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      animation: {
        "fade-in":      "fadeIn 0.3s ease-out",
        "slide-up":     "slideUp 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "pulse-slow":   "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "shimmer":      "shimmer 2s linear infinite",
        "float":        "float 3s ease-in-out infinite",
        "glow-pulse":   "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:      { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:     { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideInLeft: { from: { opacity: "0", transform: "translateX(-16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        shimmer:     { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float:       { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        glowPulse:   { "0%, 100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
