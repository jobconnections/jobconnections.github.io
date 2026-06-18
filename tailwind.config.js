/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: '#18589D',
        secondary: '#3688C8',
        accent: '#F3F4F6',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
}

