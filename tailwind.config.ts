import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        // Micro devices (small phones, min viable web width)
        xs: '380px',
        // Standard Tailwind: sm 640, md 768, lg 1024, xl 1280, 2xl 1536
        // TV / large displays
        '3xl': '1920px',
        // Ultra-wide / 4K
        '4xl': '2560px',
      },
      colors: {
        // Bekenya brand — warm Kenyan earth tones + modern accent
        brand: {
          red: '#CC0000',       // Kenyan flag red
          green: '#006600',     // Kenyan flag green
          black: '#000000',
          gold: '#FFD700',      // opportunity / prosperity
          orange: '#FF6B35',    // energy / action (primary CTA)
          teal: '#0891B2',      // trust / global
        },
        surface: {
          light: '#FAFAF8',
          dark: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
