export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cineverse-black': '#000000',
        'cineverse-gray': '#121212',
        'cineverse-card': '#1a1a1a',
        'cineverse-hover': '#2b2b2b',
        'cineverse-cyan': '#00F2FE',
        'cineverse-blue': '#5799ef'
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
