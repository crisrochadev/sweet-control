/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "sw-p": "#ea5b5f",
      "sw-s": "#f8c6ba",
      "sw-a": "#f8c6ba",
      ...colors
    },
    extend: {},
  },
  plugins: [],
};
