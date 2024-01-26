/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "sw-primary": "#b117e1",
      "sw-secondary": "#680f9c",
      "sw-accent": "#9C27B0",
      gray: colors.gray,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
    },
    extend: {},
  },
  plugins: [],
};
