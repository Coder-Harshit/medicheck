// FILE: tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--primary) / 0.05)',
          100: 'rgb(var(--primary) / 0.1)',
          500: 'rgb(var(--primary) / 1)',
          600: 'rgb(var(--primary) / 0.9)',
          700: 'rgb(var(--primary) / 0.8)',
        },
        secondary: {
          50: 'rgb(var(--secondary) / 0.05)',
          100: 'rgb(var(--secondary) / 0.1)',
          500: 'rgb(var(--secondary) / 1)',
          600: 'rgb(var(--secondary) / 0.9)',
          700: 'rgb(var(--secondary) / 0.8)',
        },
        background: 'rgb(var(--background) / 1)',
      },
    },
  },
  plugins: [],
}

export default config