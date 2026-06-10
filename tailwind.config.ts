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
        // Brand (Logo Blue)
        brand: {
          50:  "#f0f5fc",
          100: "#dce8f9",
          200: "#c0d6f4",
          300: "#94bbeb",
          400: "#5c98df",
          500: "#0b4395",
          600: "#09377a",
          700: "#072a5d",
          800: "#051d42",
          900: "#031128",
        },
        // Dark backgrounds (remapped to light mode)
        dark: {
          950: "#f8fafc",
          900: "#ffffff",
          850: "#f8fafc",
          800: "#f1f5f9",
          750: "#e2e8f0",
          700: "#cbd5e1",
          600: "#94a3b8",
          500: "#64748b",
          400: "#475569",
        },
        // Neon accents (Logo Blue and Logo Orange)
        neon: {
          blue:   "#0b4395",
          purple: "#f47321",
          cyan:   "#ff7e36",
          green:  "#10b981",
          pink:   "#f472b6",
        },
        // Override standard colors to match logo colors
        indigo: {
          50:  "#f0f5fc",
          100: "#dce8f9",
          200: "#c0d6f4",
          300: "#94bbeb",
          400: "#5c98df",
          500: "#0b4395",
          600: "#0b4395",
          700: "#09377a",
          800: "#072a5d",
          900: "#051d42",
          950: "#031128",
        },
        purple: {
          50:  "#fff5ed",
          100: "#ffe7d4",
          200: "#ffcfa9",
          300: "#ffa971",
          400: "#ff7e36",
          500: "#f47321",
          600: "#d8560e",
          700: "#b43f0c",
          800: "#8f310f",
          900: "#742a10",
        },
        violet: {
          50:  "#fff5ed",
          100: "#ffe7d4",
          200: "#ffcfa9",
          300: "#ffa971",
          400: "#ff7e36",
          500: "#f47321",
          600: "#d8560e",
          700: "#b43f0c",
          800: "#8f310f",
          900: "#742a10",
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
        "gradient-brand":    "linear-gradient(135deg, #0b4395 0%, #f47321 100%)",
        "gradient-neon":     "linear-gradient(135deg, #0b4395 0%, #f47321 100%)",
        "gradient-dark":     "linear-gradient(180deg, #050810 0%, #0d1117 100%)",
        "gradient-card":     "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        "gradient-glow-blue": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(11, 67, 149, 0.3) 0%, transparent 60%)",
        "gradient-glow-purple": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(244, 115, 33, 0.3) 0%, transparent 60%)",
      },
      boxShadow: {
        "glow-blue":   "0 0 30px rgba(11, 67, 149, 0.3)",
        "glow-purple": "0 0 30px rgba(244, 115, 33, 0.3)",
        "glow-cyan":   "0 0 30px rgba(244, 115, 33, 0.3)",
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
