/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#8FD9A8', // Light green
          DEFAULT: '#4CAF50', // Green
          dark: '#2E7D32', // Dark green
        },
        secondary: {
          light: '#81D4FA', // Light blue
          DEFAULT: '#03A9F4', // Blue
          dark: '#0288D1', // Dark blue
        },
      },
    },
  },
  plugins: [],
}
