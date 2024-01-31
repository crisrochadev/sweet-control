/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "sw-primary": "#ea5b5f",
      "sw-secondary": "#f8c6ba",
      "sw-accent": "#f8c6ba",
      gray: colors.gray,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
      white: colors.white,
      red: colors.red,
    },
    extend: {},
  },
  plugins: [],
};
