/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // keep "primary" so existing classes still work
        primary: "#7c3aed", // violet-600
      },
      boxShadow: {
        // optional: if you ever use shadow-primary directly (not required)
      },
    },
  },
  plugins: [],
};
