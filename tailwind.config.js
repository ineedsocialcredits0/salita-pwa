/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E86AB',
          light: '#5FA8C8',
          dark: '#1A5F7A'
        },
      },
    },
  },
  plugins: [],
}