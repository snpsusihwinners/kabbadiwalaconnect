/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        vernacular: ['"Rozha One"', '"Yatra One"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        setu: {
          dark: '#071610',
          forest: '#0c2e22',
          emerald: '#10b981',
          mint: '#34d399',
          neon: '#10f5a5',
          patina: '#0d9488',
          brass: '#d97706',
          copper: '#c2410c',
          amber: '#f59e0b',
          parchment: '#fbf8f1',
          sand: '#f2ede0',
          card: '#ffffff',
        }
      },
      boxShadow: {
        'tactile': '0 4px 0 0 rgba(12, 46, 34, 0.9), 0 8px 16px -4px rgba(0, 0, 0, 0.15)',
        'tactile-pressed': '0 1px 0 0 rgba(12, 46, 34, 0.9), 0 2px 4px -1px rgba(0, 0, 0, 0.15)',
        'tactile-green': '0 6px 0 0 #075e42, 0 12px 24px -4px rgba(16, 185, 129, 0.35)',
        'tactile-brass': '0 6px 0 0 #92400e, 0 12px 24px -4px rgba(217, 119, 6, 0.35)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.35)',
        'card-elevated': '0 10px 30px -10px rgba(7, 22, 16, 0.08), 0 4px 6px -2px rgba(7, 22, 16, 0.04)',
      },
      backgroundImage: {
        'grain-pattern': "radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.08) 1px, transparent 0)",
        'circuit-pattern': "radial-gradient(circle, rgba(16, 185, 129, 0.15) 1.5px, transparent 1.5px)",
      }
    },
  },
  plugins: [],
}
