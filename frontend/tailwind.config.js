/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0F19',
          light: '#F8FAFC'
        },
        surface: {
          DEFAULT: '#131826',
          light: '#FFFFFF'
        },
        'surface-glass': {
          DEFAULT: 'rgba(19, 24, 38, 0.65)',
          light: 'rgba(255, 255, 255, 0.75)'
        },
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#60A5FA',
          dark: '#1D4ED8'
        },
        accent: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#34D399',
          dark: '#047857'
        },
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          light: '#F87171'
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FBBF24'
        },
        'text-primary': {
          DEFAULT: '#E5E7EB',
          light: '#0F172A'
        },
        'text-muted': {
          DEFAULT: '#9CA3AF',
          light: '#64748B'
        },
        border: {
          DEFAULT: '#1F2937',
          light: '#E2E8F0'
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      },
      borderRadius: {
        'card': '1rem',
        '2xl': '1rem'
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(59, 130, 246, 0.35)',
        'glow-accent': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-danger': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
