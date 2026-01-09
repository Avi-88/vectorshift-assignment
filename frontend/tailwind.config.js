/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#09090b',         // Very deep black/gray
          surface: '#18181b',    // Slightly lighter for panels
          card: 'rgba(24, 24, 27, 0.6)', // Glassy card background
          border: '#27272a',     // Subtle border
          text: '#e4e4e7',       // High contrast text
          'text-muted': '#a1a1aa',
        },
        accent: {
          purple: '#c084fc',
          pink: '#f472b6',
          blue: '#60a5fa',
          green: '#4ade80',
        }
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(192, 132, 252, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
