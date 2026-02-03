/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    // if you import shared UI package components directly:
    "../../packages/ui-inner-shared/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
      },
      colors: {
        // ✅ Brand tokens (use these everywhere)
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--primary-dark) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "background-light": "rgb(var(--bg-light) / <alpha-value>)",
        "background-dark": "rgb(var(--bg-dark) / <alpha-value>)",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(0,0,0,0.12)",
        "soft-lg": "0 26px 70px rgba(0,0,0,0.16)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
