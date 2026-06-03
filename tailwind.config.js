/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50020',
        secondary: '#120d0e',
        accent1: '#f3eee9',
        accent2: '#cc141c',
        background: '#f3eee9',
        text: '#120d0e',
        'off-white': '#F4F0EA',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        secondary: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
