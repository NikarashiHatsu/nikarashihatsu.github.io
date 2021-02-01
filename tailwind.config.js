module.exports = {
  purge: [
    './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      'display': ['"Exo 2"'],
      'heading': ['"Roboto Slab"']
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
