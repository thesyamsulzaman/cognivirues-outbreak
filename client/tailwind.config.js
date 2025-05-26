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
      colors: {
        primary: {
          DEFAULT: '#8960AF',
          800: '#B89EE7',
          700: '#C3ACE0',
          200: '#EFE9F7',
          100: '#F9F7F3',
        },
      },
      screens: {
        '2xs': '320px',
        xs: '375px',
        desktop: '1360px',
        '2desktop': '1440px',
      },
      keyframes: {
        bounceBack: {
          '0%': { transform: 'translateY(0)' },
          '20%': { transform: 'translateY(-20%)' }, // pop up
          '50%': { transform: 'translateY(10%)' },  // recoil down
          '70%': { transform: 'translateY(-5%)' },  // slight up
          '100%': { transform: 'translateY(0)' },   // settle back
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '25%, 75%': { opacity: '0' }, // hard blink in/out
        },
      },
      animation: {
        bounceBack: 'bounceBack 0.4s ease-out',
        blink: 'blink 0.4s steps(1, start) 1',
      },
    },
  },
  plugins: [],
}
