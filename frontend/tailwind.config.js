/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      'var(--bg-primary)',
        surface: 'var(--bg-secondary)',
        panel:   'var(--bg-tertiary)',
        text:    'var(--text-primary)',
        muted:   'var(--text-secondary)',
        accent:  'var(--accent-violet)',
        rose:    'var(--accent-rose)',
        cyan:    'var(--accent-cyan)',
        amber:   'var(--accent-amber)',
        emerald: 'var(--accent-emerald)',
        fuchsia: 'var(--accent-fuchsia)',
        indigo:  'var(--accent-indigo)',
        border:  'var(--border-default)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      }
    },
  },
  plugins: [],
}
