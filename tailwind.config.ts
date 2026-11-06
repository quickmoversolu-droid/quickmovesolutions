import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        brand: {
          black: '#05080D',
          obsidian: '#080E1A',
          card: '#0C1526',
          navy: {
            DEFAULT: '#101D35',
            light: '#1B2F52',
            dark: '#0A1222',
            50: '#F0F4FA',
            100: '#DCE5F3',
            200: '#B9CBE7',
            300: '#8BA8D6',
            400: '#5C82C1',
            500: '#3960A3',
            600: '#274880',
            700: '#1B345E',
            800: '#101D35',
            900: '#0A1222',
          },
          orange: {
            DEFAULT: '#F47732',
            hover: '#E0641F',
            light: '#FFF3EC',
            dark: '#C85212',
            50: '#FFF5EF',
            100: '#FFE7D6',
            200: '#FFCBAD',
            300: '#FFA878',
            400: '#FA8B4F',
            500: '#F47732',
            600: '#E0641F',
            700: '#BA4B12',
            800: '#943C13',
            900: '#783313',
          },
          charcoal: {
            DEFAULT: '#222A35',
            muted: '#4A5565',
            subtle: '#647084',
          },
          surface: {
            white: '#FFFFFF',
            grey: '#F4F6F8',
            border: '#E2E7EE',
          },
        },
      },
      fontFamily: {
        heading: ['var(--font-manrope)', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw + 1rem, 4.25rem)', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-lg': ['clamp(2rem, 3.8vw + 0.75rem, 3.25rem)', { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '800' }],
        'heading-1': ['clamp(1.75rem, 2.8vw + 0.5rem, 2.5rem)', { lineHeight: '1.18', letterSpacing: '-0.018em', fontWeight: '700' }],
        'heading-2': ['clamp(1.375rem, 2vw + 0.4rem, 1.875rem)', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],
        'heading-3': ['clamp(1.125rem, 1.2vw + 0.3rem, 1.375rem)', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(16, 29, 53, 0.06), 0 1px 3px -1px rgba(16, 29, 53, 0.04)',
        'card-hover': '0 16px 36px -6px rgba(16, 29, 53, 0.12), 0 4px 10px -2px rgba(16, 29, 53, 0.06)',
        'cta': '0 8px 24px -4px rgba(244, 119, 50, 0.42)',
        'cta-hover': '0 12px 32px -4px rgba(244, 119, 50, 0.6)',
        'navy-lg': '0 20px 45px -10px rgba(5, 8, 13, 0.55)',
        'dark-card': '0 12px 32px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.07)',
        'orange-glow': '0 0 28px -2px rgba(244, 119, 50, 0.38), inset 0 0 12px rgba(244, 119, 50, 0.12)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
      },
      animation: {
        'float-slow': 'float-slow 5s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;

