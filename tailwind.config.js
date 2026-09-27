/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#04060b', 900: '#070a12', 850: '#0a0e19', 800: '#0e1322', 700: '#151b2e', 600: '#1e2640' },
        line: 'rgba(130,150,200,0.12)',
        signal: { DEFAULT: '#4fd4ff', dim: '#2b8fb3' },
        volt: { DEFAULT: '#8f7cff', dim: '#5d4fc2' },
        spark: { DEFAULT: '#ff5f86' },
        mute: '#8a93ad',
        fog: '#c5cbe0',
      },
      fontFamily: {
        display: ['"Sora Variable"', 'Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: { tightest: '-0.045em' },
      maxWidth: { site: '1240px' },
    },
  },
  plugins: [],
};
