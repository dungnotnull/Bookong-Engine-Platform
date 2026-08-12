/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rausch: {
          DEFAULT: '#FF385C',
          hover: '#E00B41',
        },
        main: '#222222',
        muted: '#6A6A6A',
        surface: '#F7F7F7',
        border: {
          light: '#EBEBEB',
          DEFAULT: '#DDDDDD',
        },
        booking: {
          navy: '#003580',
          blue: '#006CE4',
          yellow: '#FEBB02',
        },
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'airbnb-card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'airbnb-hover': '0 6px 20px rgba(0, 0, 0, 0.12)',
        'pill-search': '0 3px 12px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'modal': '0 8px 28px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
}
