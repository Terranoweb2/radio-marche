/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        'player-dark': '#0D0C1D',
        'player-light': '#1D1C30',
        'player-text-secondary': '#a09fb1',
      }
    }
  },
  plugins: [],
};
