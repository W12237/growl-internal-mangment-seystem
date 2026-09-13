/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Brand Identity ── */
        nightshade: {
          DEFAULT: '#000823',
          50: '#e6e8f0',
          100: '#c0c5d9',
          200: '#8a93bd',
          300: '#5461a0',
          400: '#2a3882',
          500: '#000823',   /* pure Nightshade */
          600: '#000720',
          700: '#00051a',
          800: '#000312',
          900: '#00020a',
        },
        'white-tech': {
          DEFAULT: '#F8F8F8',
          50: '#ffffff',
          100: '#F8F8F8',   /* pure White Tech */
          200: '#F0F0F2',
          300: '#E4E4E8',
          400: '#D1D5DB',
          500: '#9CA3AF',
        },
        /* ── Legacy primary kept for backward compat ── */
        primary: {
          50:  '#e6e8f0',
          500: '#000823',
          600: '#000720',
          700: '#00051a',
        },
      },
    },
  },
  plugins: [],
}
