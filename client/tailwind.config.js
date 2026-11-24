/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pilgrim: {
          ivory: '#FFFDF9',
          cream: '#FAF6EE',
          sand: '#F2ECE1',
          gold: '#D4AF37',
          goldLight: '#FDF6E2',
          saffron: '#E36414',
          saffronDeep: '#C84C04',
          marigold: '#FB8500',
          teal: '#0F4C5C',
          tealDark: '#0B3844',
          tealLight: '#E6F0F2',
          forest: '#114B5F',
          earth: '#5C3D2E',
          softRed: '#D62828'
        }
      },
      fontFamily: {
        devanagari: ['"Hind"', '"Noto Sans Devanagari"', '"Mukta"', 'sans-serif'],
        heading: ['"Rozha One"', '"Cinzel"', 'serif', '"Hind"']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 76, 92, 0.08), 0 2px 6px -1px rgba(15, 76, 92, 0.04)',
        'sacred': '0 10px 35px -5px rgba(227, 100, 20, 0.15)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
