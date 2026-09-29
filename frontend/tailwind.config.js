/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '860px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        base: '#07070C',
        elevated: '#0C0C14',
        ink: {
          DEFAULT: '#FBFBFD',
          2: 'rgba(255,255,255,0.72)',
          3: 'rgba(255,255,255,0.50)',
          4: 'rgba(255,255,255,0.34)',
        },
        accent: {
          DEFAULT: '#6366F1',
          bright: '#818CF8',
          soft: 'rgba(99,102,241,0.16)',
          glow: 'rgba(99,102,241,0.45)',
        },
        success: {
          DEFAULT: '#34D399',
          soft: 'rgba(52,211,153,0.16)',
          glow: 'rgba(52,211,153,0.40)',
        },
        warn: {
          DEFAULT: '#FBBF24',
          soft: 'rgba(251,191,36,0.14)',
        },
        danger: {
          DEFAULT: '#F87171',
          soft: 'rgba(248,113,113,0.14)',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.045)',
          strong: 'rgba(255,255,255,0.075)',
          hover: 'rgba(255,255,255,0.10)',
          border: 'rgba(255,255,255,0.12)',
          bright: 'rgba(255,255,255,0.22)',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      fontSize: {
        display: ['clamp(2.25rem,5vw,3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
      },
      borderRadius: { sm: '10px', md: '16px', lg: '24px' },
      backdropBlur: { sm: '8px', md: '18px', lg: '28px' },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.14)',
        'glass-lg': '0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.14)',
        'accent-glow': '0 6px 20px rgba(99,102,241,0.45)',
        'accent-glow-lg': '0 10px 28px rgba(99,102,241,0.45)',
        'success-glow': '0 6px 22px rgba(52,211,153,0.40)',
        'focus-ring': '0 0 0 3px rgba(99,102,241,0.45)',
      },
      transitionTimingFunction: { out: 'cubic-bezier(0.22,1,0.36,1)' },
      keyframes: {
        rise: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'none' } },
        screenIn: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'none' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        float: { to: { transform: 'translate(60px,40px) scale(1.1)' } },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(0.22,1,0.36,1) both',
        'screen-in': 'screenIn .5s cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 1.8s cubic-bezier(0.22,1,0.36,1) infinite',
        spin: 'spin .8s linear infinite',
        'spin-slow': 'spin 2.4s linear infinite',
        float: 'float 22s cubic-bezier(0.22,1,0.36,1) infinite alternate',
      },
    },
  },
  plugins: [],
}
