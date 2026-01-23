/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui-inner-shared/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#001e3f",
        accent: "#D4AF37",
        "background-light": "#f6f7f8",
        "background-dark": "#121820",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
