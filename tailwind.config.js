/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md,html,js}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2a4698',
          dark: '#1e3470',
          light: '#e8edf8',
          green: '#2dc089',
        },
        neutral: {
          warm: '#f8f5f0',
          mid: '#6b6b6b',
          dark: '#1a1a1a',
        },
        alert: {
          info: '#2a4698',
          warning: '#b45309',
          urgent: '#b91c1c',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        base: ['1rem', { lineHeight: '1.6' }],
      }
    }
  },
  plugins: []
};
