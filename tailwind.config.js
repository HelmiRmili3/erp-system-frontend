/** @type {import('tailwindcss').Config} */
export default {
  //purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'infinite-scroll': 'infinite-scroll 40s linear infinite'
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-50% - 16px))' }
        }
      }
    }
  },
  plugins: []
}
