/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",

    // 🔥 IMPORTANT: scan shared UI package
    "../../packages/ui-inner-shared/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2ec2b3",
        "primary-dark": "#259c8f",
        "accent-yellow": "#fcd34d",
        "background-light": "#f6f8f8",
        "background-dark": "#131f1e",
        "surface-light": "#ffffff",
        "surface-dark": "#1c2a29",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
