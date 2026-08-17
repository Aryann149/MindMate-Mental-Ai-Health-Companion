/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        base: {
          950: "#080B14",
          900: "#0B1120",
          800: "#111827",
          700: "#1A2236",
        },
        lavender: {
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
        },
        mint: {
          300: "#99F6E4",
          400: "#5EEAD4",
          500: "#2DD4BF",
        },
        coral: {
          400: "#FB923C",
          500: "#F97316",
        },
        bloom: {
          400: "#F472B6",
          500: "#EC4899",
        },
      },
      backgroundImage: {
        "aurora": "radial-gradient(60% 60% at 20% 20%, rgba(167,139,250,0.25) 0%, rgba(0,0,0,0) 60%), radial-gradient(50% 50% at 80% 30%, rgba(94,234,212,0.18) 0%, rgba(0,0,0,0) 60%), radial-gradient(60% 60% at 50% 100%, rgba(244,114,182,0.12) 0%, rgba(0,0,0,0) 60%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 40px rgba(167,139,250,0.25)",
      },
      animation: {
        "breathe": "breathe 6s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "fade-up": "fadeUp 0.5s ease-out both",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
