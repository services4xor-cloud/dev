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
      // ── Golden Ratio (φ = 1.618) Design Tokens ─────────────────────────
      // Spacing: Fibonacci → 4 6 10 16 26 42 68 110 178px
      // Each step × φ. Use phi-N for harmonious layouts.
      spacing: {
        'phi-1': '0.25rem', // 4px
        'phi-2': '0.375rem', // 6px
        'phi-3': '0.625rem', // 10px
        'phi-4': '1rem', // 16px
        'phi-5': '1.625rem', // 26px
        'phi-6': '2.625rem', // 42px
        'phi-7': '4.25rem', // 68px
        'phi-8': '6.875rem', // 110px
        'phi-9': '11.125rem', // 178px
      },
      fontSize: {
        // φ-based typography scale. body = 1rem, each step × 1.272 (√φ) or φ.
        'phi-xs': ['0.618rem', { lineHeight: '1.0' }],
        'phi-sm': ['0.764rem', { lineHeight: '1.4' }],
        'phi-base': ['1rem', { lineHeight: '1.618' }], // Golden line-height
        'phi-lg': ['1.272rem', { lineHeight: '1.5' }],
        'phi-xl': ['1.618rem', { lineHeight: '1.4' }], // φ rem
        'phi-2xl': ['2.058rem', { lineHeight: '1.3' }],
        'phi-3xl': ['2.618rem', { lineHeight: '1.2' }], // φ² rem
        'phi-4xl': ['4.236rem', { lineHeight: '1.1' }], // φ³ rem
        'phi-5xl': ['6.854rem', { lineHeight: '1.0' }], // φ⁴ rem
      },
      borderRadius: {
        // φ border radius steps
        'phi-sm': '6px',
        'phi-md': '10px',
        'phi-lg': '16px',
        'phi-xl': '26px',
        'phi-2xl': '42px',
      },
      lineHeight: {
        phi: '1.618', // The golden line-height — most harmonious ratio
        'phi-tight': '1.272', // √φ — for headings
      },
      colors: {
        // ── BeNetwork Brand (Semantic Tokens) ─────────────────────────
        // CSS vars from globals.css → change ONE place, updates everywhere.
        // <alpha-value> enables opacity modifiers: bg-brand-primary/20
        // Names are role-based, not color-based — survives rebrands.
        brand: {
          primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          'primary-light': 'rgb(var(--color-primary-light-rgb) / <alpha-value>)',
          accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
          'accent-light': 'rgb(var(--color-accent-light-rgb) / <alpha-value>)',
          bg: 'rgb(var(--color-bg-rgb) / <alpha-value>)',
          surface: 'rgb(var(--color-surface-rgb) / <alpha-value>)',
          'surface-2': 'rgb(var(--color-surface-2-rgb) / <alpha-value>)',
          'surface-elevated': 'rgb(var(--color-surface-elevated-rgb) / <alpha-value>)',
          text: 'rgb(var(--color-text-rgb) / <alpha-value>)',
          success: 'rgb(var(--color-success-rgb) / <alpha-value>)',
        },
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
  plugins: [require('@tailwindcss/typography')],
}

export default config
