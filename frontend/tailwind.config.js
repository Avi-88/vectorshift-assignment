/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#050505',         
          surface: '#121212',  
          card: 'rgba(18, 18, 20, 0.7)',
          border: '#27272a',     
          text: '#e4e4e7',      
          'text-muted': '#a1a1aa',
        },
        accent: {
          purple: '#440e8c',
          pink: '#b01bcf',
          blue: '#6366F1',
          green: '#4ade80',
        }
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(168, 85, 247, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.7)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
