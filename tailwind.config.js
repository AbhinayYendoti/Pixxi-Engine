/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        pixii: {
          bg: '#09090B',
          surface: '#18181B',
          elevated: '#27272A',
          border: '#3F3F46',
          text: '#FAFAFA',
          muted: '#A1A1AA',
          green: '#6EE7B7',
          red: '#F87171',
          amber: '#FCD34D',
        }
      },
      borderRadius: {
        card: '12px',
        input: '8px',
      }
    },
  },
  plugins: [],
}
