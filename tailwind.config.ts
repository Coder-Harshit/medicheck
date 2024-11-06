// FILE: tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        'primary-dark': '#0056b3',
        secondary: '#28a745',
        'secondary-dark': '#218838', // Add this line
        background: '#f8f9fa',
        foreground: '#343a40',
        error: '#dc3545',
        success: '#28a745',
      },
    },
  },
  plugins: [],
};

export default config;