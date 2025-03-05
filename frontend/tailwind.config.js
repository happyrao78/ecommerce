/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable dark mode support
  theme: {
    extend: {
      colors: {
        'orange': {
          '50': '#fff8f1',
          '100': '#ffeadd',
          '200': '#fecdbe',
          '300': '#fda88a',
          '400': '#f9735b',
          '500': '#f44d1a',
          '600': '#db3f0e',
          '700': '#b5350b',
          '800': '#8f2908',
          '900': '#6a1d06',
          '950': '#3e1003',
        },

      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      },
    },
  },
  plugins: [],
};
