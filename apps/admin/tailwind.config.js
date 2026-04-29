/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "../dropbrand/src/**/*.{js,jsx}",
    "../../packages/ui-inner-shared/src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f4a2c",
        "primary-dark": "#07361f",
        accent: "#ffb347",
        "background-light": "#f8f4ed",
        "background-dark": "#131f1e",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(0,0,0,0.12)",
        "soft-lg": "0 26px 70px rgba(0,0,0,0.16)",
      },
    },
  },
  plugins: [],
};