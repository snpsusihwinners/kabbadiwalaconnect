/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"JetBrains Mono"', 'monospace'],
        vernacular: ['"Rozha One"', 'serif'],
      },
      colors: {
        khata: {
          paper: '#F1EFE7',
          ink: '#0C0C0C',
          red: '#D32F2F',
          blue: '#1A237E',
          green: '#2E7D32',
          border: '#D8D4C7'
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #0C0C0C',
        'brutal-sm': '2px 2px 0px 0px #0C0C0C',
        'brutal-active': '1px 1px 0px 0px #0C0C0C',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, #e5e0d3 1px, transparent 1px), linear-gradient(to bottom, #e5e0d3 1px, transparent 1px)',
        'ruled-pattern': 'linear-gradient(transparent 95%, #A8D0E6 95%)',
        'ruled-red': 'linear-gradient(transparent 95%, #ffcdd2 95%)'
      }
    },
  },
  plugins: [],
}
