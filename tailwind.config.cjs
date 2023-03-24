/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    require('path').join(require.resolve(
      '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  theme: {
    extend: {
      colors: {
        "translucent": "rgba(0, 0, 0, 0.3)"
      },
      boxShadow: {
        "nav": "inset 0 -1px 0 0 hsla(0, 0%, 100%, 0.1)"
      }
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), ...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()],
}
