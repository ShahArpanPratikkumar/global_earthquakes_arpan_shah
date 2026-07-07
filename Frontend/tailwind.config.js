/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        earth: {
          50:  '#FAF6F0',
          100: '#F5EDE0',
          200: '#E8D7C5',
          300: '#D4B896',
          400: '#C19A6B',
          500: '#A67C52',
          600: '#8B6340',
          700: '#6F4E37',
          800: '#4A3425',
          900: '#2D1F15',
          950: '#1A1008',
        },
        olive: {
          300: '#B5C48A',
          400: '#8FA35F',
          500: '#7A8B5A',
          600: '#63754A',
          700: '#4E5C39',
        },
        sand: {
          50:  '#FDFAF5',
          100: '#F8F2E6',
          200: '#F0E4CB',
          300: '#E5D0AA',
        },
        alert: {
          safe:    '#22c55e',
          medium:  '#f97316',
          high:    '#ef4444',
          extreme: '#9f1239',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        earth:      '0 4px 24px rgba(193,154,107,0.15)',
        'earth-lg': '0 8px 48px rgba(193,154,107,0.25)',
        glass:      '0 8px 32px rgba(0,0,0,0.12)',
        'glass-lg': '0 16px 64px rgba(0,0,0,0.20)',
        glow:       '0 0 30px rgba(193,154,107,0.30)',
      },
      backgroundImage: {
        'earth-gradient':  'linear-gradient(135deg, #FAF6F0 0%, #E8D7C5 100%)',
        'earth-dark':      'linear-gradient(135deg, #2D1F15 0%, #4A3425 100%)',
        'hero-gradient':   'linear-gradient(135deg, #1A1008 0%, #2D1F15 50%, #4A3425 100%)',
        'card-gradient':   'linear-gradient(135deg, rgba(193,154,107,0.1) 0%, rgba(122,139,90,0.05) 100%)',
      },
      animation: {
        'spin-slow':    'spin 25s linear infinite',
        'float':        'float 6s ease-in-out infinite',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':      'fadeIn 0.6s ease-out forwards',
        'slide-up':     'slideUp 0.5s ease-out forwards',
        'count-up':     'countUp 2s ease-out forwards',
        'shimmer':      'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
