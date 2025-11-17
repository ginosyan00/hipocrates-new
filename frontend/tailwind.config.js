/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main color from Figma
        main: {
          10: '#F5F6FF',
          100: '#3A6FF8',
        },
        // Secondary color from Figma
        secondary: {
          10: '#FFF9F6',
          100: '#14CC26',
        },
        // Text colors from Figma
        text: {
          10: '#A9A9A9',
          50: '#676767',
          100: '#1C1C1C',
        },
        // Background colors from Figma
        bg: {
          primary: '#FBFBFB',
          white: '#FFFFFF',
        },
        // Stroke/Border color from Figma
        stroke: '#F1F1F1',
        // Primary colors for landing page (based on Figma)
        primary: {
          50: '#F0F5FF',
          100: '#E5EDFF',
          200: '#C7D7FE',
          300: '#A5BBFE',
          400: '#7B96FD',
          500: '#3A6FF8',
          600: '#2952D6',
          700: '#1E3FB3',
          800: '#162E8C',
          900: '#0F2166',
        },
        // Accent colors for landing page
        accent: {
          50: '#FFF9F6',
          100: '#FFF3ED',
          200: '#FFE4D5',
          300: '#FFD0B5',
          400: '#FFB088',
          500: '#FF8A4C',
          600: '#F76B1C',
          700: '#D84F0A',
          800: '#B03C07',
          900: '#8B2E05',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '15px',
      },
      boxShadow: {
        'figma': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'figma-md': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'figma-lg': '0 10px 24px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

