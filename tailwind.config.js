/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Rubik: ["Rubik", "sans-serif"],
        'Open-Sans': ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
