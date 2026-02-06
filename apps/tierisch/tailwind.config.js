/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

    // ✅ monorepo packages (adjust path if needed)
    "../../packages/ui-inner-shared/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui-inner-shared/src/**/*.{js,ts,jsx,tsx}",

    // agar aur shared packages hain:
    "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
