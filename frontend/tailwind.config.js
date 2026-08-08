/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          intel: '#0068B5',
          amd: '#ED1C24',
          qualcomm: '#3253DC',
          apple: '#555555'
        }
      }
    },
  },
  plugins: [],
}
