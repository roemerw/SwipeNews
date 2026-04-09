/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shell: '#c7dbed',
        shellDeep: '#a7c2db',
        frame: '#d9e8f4',
        ink: '#10253e',
        muted: '#496078',
        line: '#adc5d8',
        accent: '#1d4f91',
        accentSoft: '#dbe8f6',
      },
      boxShadow: {
        frame: '0 18px 40px rgba(16, 37, 62, 0.16)',
        card: '0 18px 34px rgba(23, 41, 69, 0.16)',
      },
    },
  },
  plugins: [],
}
