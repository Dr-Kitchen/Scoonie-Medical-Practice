/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md,html,js}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2D3A6E',
          dark: '#1E2A5E',
          light: '#EEF0F7',
          accent: '#2EC4B2',
          'accent-dark': '#22A699',
        },
        neutral: {
          warm: '#f8f5f0',
          mid: '#6b6b6b',
          dark: '#1a1a1a',
        },
        alert: {
          info: '#2D3A6E',
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
