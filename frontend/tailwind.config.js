/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inknut: ['"Inknut Antiqua"', "serif"],
        kufam: ["Kufam", "sans-serif"],
        gentium: ['"Gentium Book Basic"', "serif"],
        yatra: ['"Yatra One"', "cursive"],
        inria: ['"Inria Sans"', "serif"],
      },
    },
  },
  plugins: [],
};
