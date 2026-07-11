/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          primary: 'var(--color-primary)',
          primaryDark: 'var(--color-primary-dark)',
          primaryLight: 'var(--color-primary-light)',
          secondary: 'var(--color-secondary)',
          background: 'var(--color-background)',
          surface: 'var(--color-surface)',
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)',
          text: 'var(--color-text-primary)',
          muted: 'var(--color-text-secondary)',
          border: 'var(--color-border)'
        },
        petrol: {
          50: '#e9f7f7',
          100: '#caebec',
          500: '#0f5c63',
          600: '#0b4a50',
          700: '#083b41'
        },
        aqua: '#2bbdc1',
        calmgreen: '#2f8f69',
        softamber: '#b7791f'
      },
      boxShadow: {
        soft: '0 12px 35px rgba(15, 92, 99, 0.10)',
        card: '0 14px 40px rgba(15, 92, 99, 0.08)'
      }
    },
  },
  plugins: [],
};
