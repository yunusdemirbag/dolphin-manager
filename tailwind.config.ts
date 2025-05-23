import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundColor: {
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          tertiary: '#3d3d3d',
        },
      },
      textColor: {
        dark: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          tertiary: '#707070',
        },
      },
      borderColor: {
        dark: {
          primary: '#404040',
          secondary: '#505050',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
