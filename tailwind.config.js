/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "src/**/*.tsx"
  ],
  theme: {
    extend: {
      maxHeight: {
        'half-screen': '50vh',
        '4/5': '80%'
      },
      maxWidth: {
        '3/5': '60%',
        'screen-minus-padding': 'calc(100vw - 2rem)'
      },
      height: {
        'span': 'calc(100vh - 160px)',
        'span-2': 'calc(100vh - 84px)',
        'span-3': 'calc(100vh - 124px)',
      }
    },
  },
  plugins: [],
}

