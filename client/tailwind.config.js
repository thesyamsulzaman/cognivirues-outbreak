// tailwind.config.js
/**  @type {import('tailwindcss').Config}  */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    darkMode: 'class',
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      screens: {
        '2xs': '320px',
        xs: '375px',
        desktop: '1360px',
        '2desktop': '1440px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-topnav':
          'linear-gradient(64.01deg, #EFE9F7 12.96%, #EFE9F7 38.26%, #F4D4A0 112.81%)',
          'gradient-1':
          'linear-gradient(64.01deg, #EFE9F7 12.96%, #EFE9F7 38.26%, #F4D4A0 112.81%)',
      },
      fontSize: {
        'display-d1': ['4.5rem', { lineHeight: '4.5rem', fontWeight: 600 }],
        'heading-h2': ['3.25rem', { lineHeight: '3.75rem', fontWeight: 600 }],
        'heading-h3': ['2.5rem', { lineHeight: '2.875rem', fontWeight: 600 }],
        'heading-h4': ['2rem', { lineHeight: '2.375rem', fontWeight: 600 }],
        'heading-h5': ['1.5rem', { lineHeight: '1.75rem', fontWeight: 600 }],
        'heading-h6': ['1.313rem', { lineHeight: '1.563rem', fontWeight: 600 }],
        'body-small-reguler': ['0.875rem', { lineHeight: '1.25rem', fontWeight: 400 }],
        'body-small-medium': ['0.875rem', { lineHeight: '1.25rem', fontWeight: 500 }],
        'body-small-semibold': ['0.875rem', { lineHeight: '1.25rem', fontWeight: 600 }],
        'body-small-bold': ['0.875rem', { lineHeight: '1.25rem', fontWeight: 700 }],

        'body-normal-reguler': ['1rem', { lineHeight: '1.5rem', fontWeight: 400 }],
        'body-normal-medium': ['1rem', { lineHeight: '1.5rem', fontWeight: 500 }],
        'body-normal-semibold': ['1rem', { lineHeight: '1.5rem', fontWeight: 600 }],
        'body-normal-bold': ['1rem', { lineHeight: '1.5rem', fontWeight: 700 }],

        'body-large-reguler': ['1.125rem', { lineHeight: '1.75rem', fontWeight: 400 }],
        'body-large-medium': ['1.125rem', { lineHeight: '1.75rem', fontWeight: 500 }],
        'body-large-semibold': ['1.125rem', { lineHeight: '1.75rem', fontWeight: 600 }],
        'body-large-bold': ['1.125rem', { lineHeight: '1.75rem', fontWeight: 700 }],

        'body-xlarge-reguler': ['1.25rem', { lineHeight: '2rem', fontWeight: 400 }],
        'body-xlarge-medium': ['1.25rem', { lineHeight: '2rem', fontWeight: 500 }],
        'body-xlarge-semibold': ['1.25rem', { lineHeight: '2rem', fontWeight: 600 }],
        'body-xlarge-bold': ['1.25rem', { lineHeight: '2rem', fontWeight: 700 }],

        'button-small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: 600 }],
        'button-normal': ['1rem', { lineHeight: '1.5rem', fontWeight: 600 }],

        'label-small': ['0.75rem', { lineHeight: '1rem', fontWeight: 500 }],
      },
      boxShadow: {
        // 'elevations-200': '0px 2px 4px -1px rgba(118,89,170,0.06), 0px 4px 6px -1px rgba(118,89,170,0.1)',
        'elevations-200': '0px 2px 4px -1px rgba(118, 89, 170, 0.06), 0px 4px 6px -1px rgba(118, 89, 170, 0.1)',
        button: '0px 4px 10px 0px rgba(184, 158, 231, 0.4)'
      },
      colors: {
        primary: {
          DEFAULT: '#8960AF',
          800: '#B89EE7',
          700: '#C3ACE0',
          200: '#EFE9F7',
          100: '#F9F7F3',
        },
        secondary: {
          DEFAULT: '#F6AE3B',
          700: '#F4D4A0',
          300: '#FFE6C5',
          200: '#FFF8E6',
          100: '#F9F7F3',
          500: '#D7CAAF',
        },
        success: {
          DEFAULT: '#D3E189',
          200: '#F7FCE0',
          300: '#E7EEBF',
        },
        dark: {
          DEFAULT: '#2D2D3A',
          600: '#383D43',
        },
        white: {
          DEFAULT: '#FFFFFF',
        },
        transparent: {
          DEFAULT: 'transparent',
        },
        brand: {
          DEFAULT: '#ff0000',
          black: '#2D2D3A',
          white: '#FFFFFF',
          purple: '#B89EE7',
          "light-orange": '#F4D4A0',
          "light-purple-1": '#C3ACE0',
          "light-purple-2": "#F8F8FD",
          "soft-green": '#E7EEBF'
        }
      },
    },
  },
  plugins: [],
}
