import type { Config } from "tailwindcss";

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "420px",
      sm: "640px",
      nav: "860px",
      md: "900px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        porcelain: v("porcelain"),
        oat: v("oat"),
        ink: v("ink"),
        maroon: v("maroon"),
        "maroon-deep": "#3D100C",
        "loader-maroon": "#5D1E17",
        clay: "#C49A7E",
        leaf: "#2F5D3A",
        teal: "#1F6E6A",
        "on-maroon": v("on-maroon"),
        // Fixed colours for sections that never switch with dark mode
        "fixed-porcelain": "#FFFDF9",
        "fixed-maroon": "#5A1A14",
        "fixed-ink": "#2A1714",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        hero: ["clamp(40px, 13vw, 220px)", { lineHeight: "0.9" }],
        section: ["clamp(40px, 5.4vw, 84px)", { lineHeight: "1.02" }],
        drink: ["clamp(44px, 7vw, 104px)", { lineHeight: "0.98" }],
        tagline: ["clamp(34px, 6vw, 84px)", { lineHeight: "1.04" }],
        body: ["18px", { lineHeight: "1.65" }],
        label: ["14px", { lineHeight: "1.4" }],
      },
      maxWidth: { site: "1280px" },
      borderRadius: { arch: "999px 999px 26px 26px" },
      transitionTimingFunction: { soft: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

export default config;
