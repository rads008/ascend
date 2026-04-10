/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  "#FFFDF7",
          100: "#FFF9EC",
          200: "#FFF3D6",
          300: "#FDECC8",
          400: "#F9E0B0",
        },
        coral: {
          300: "#FF9B8A",
          400: "#FF7A65",
          500: "#F45C43",
          600: "#E04A32",
        },
        gold: {
          300: "#F5D97A",
          400: "#EEC84A",
          500: "#D4A017",
          600: "#B8860B",
        },
        sage: {
          300: "#A8C5A0",
          400: "#8DB485",
          500: "#6B9B5E",
        },
        slate: {
          750: "#2D3748",
          850: "#1A202C",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 20px rgba(0,0,0,0.06)",
        card: "0 4px 32px rgba(0,0,0,0.08)",
        glow: "0 0 24px rgba(244, 92, 67, 0.15)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.6 } },
      },
    },
  },
  plugins: [],
};
