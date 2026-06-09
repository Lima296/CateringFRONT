/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ea580c", // orange-600
        secondary: "#1f2937", // gray-800
      }
    },
  },
  plugins: [],
}
