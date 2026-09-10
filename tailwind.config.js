/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        forest: {
          50: '#F0FDF4',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#0D7A5B',
          700: '#135541',
          800: '#0D3E2F',
          900: '#072B20',
          950: '#041B14',
        },
        copper: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        paper: {
          50: '#FDFDFB',
          100: '#F9F9F5',
          200: '#F1F1E8',
          300: '#E5E6DC',
          400: '#D3D5C5',
          500: '#A2A591',
        },
        industrial: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#090D14',
        }
      },
      boxShadow: {
        'tactile': '0 2px 0 0 rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.1)',
        'tactile-md': '0 4px 0 0 rgba(0,0,0,0.04), 0 4px 12px -2px rgba(0,0,0,0.08)',
        'tactile-lg': '0 6px 0 0 rgba(0,0,0,0.03), 0 10px 24px -4px rgba(0,0,0,0.12)',
        'ticket': '0 8px 30px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}


