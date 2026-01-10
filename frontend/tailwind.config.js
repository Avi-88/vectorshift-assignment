/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#09090b',         
          surface: '#18181b',  
          card: 'rgba(24, 24, 27, 0.6)',
          border: '#27272a',     
          text: '#e4e4e7',      
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
