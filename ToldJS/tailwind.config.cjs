/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
      postlort: {
        "primary": "#30b7e2",
        "secondary": "#60c583",
        "accent": "#60c583",
        "neutral": "#1d1d1d",
        "base-100": "#000000",
        "info": "#30b7e2",
        "success": "#60c583",
        "warning": "#FBBD23",
        "error": "#df4a4c",
      }
    },
    ]
  },
  plugins: [require("daisyui")],
}
