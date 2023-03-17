/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#30b7e2",
          "secondary": "#60c583",
          "accent": "#60c583",
          "neutral": "#e7e5e4",
          "base-100": "#f5f5f4",
          "info": "#30b7e2",
          "success": "#60c583",
          "warning": "#fbbd23",
          "error": "#df4a4c",
        },
        dark: {
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
  plugins: [require('@tailwindcss/typography'), require("daisyui")],
}
