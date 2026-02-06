/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
  "brand": {
    "primary": "rgb(var(--brand-primary) / <alpha-value>)",
    "accent": "rgb(var(--brand-accent) / <alpha-value>)",
    "bg": "rgb(var(--brand-bg) / <alpha-value>)",
    "surface": "rgb(var(--brand-surface) / <alpha-value>)",
    "text": "rgb(var(--brand-text) / <alpha-value>)",
    "muted": "rgb(var(--brand-muted) / <alpha-value>)",
    "border": "rgb(var(--brand-border) / <alpha-value>)"
  }
}
    },
  },
  plugins: [],
};
