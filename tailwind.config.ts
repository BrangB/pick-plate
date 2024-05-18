import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'waikawa-gray': {
          '50': '#f2f7fb',
          '100': '#e7f0f8',
          '200': '#d3e2f2',
          '300': '#b9cfe8',
          '400': '#9cb6dd',
          '500': '#839dd1',
          '600': '#6a7fc1',
          '700': '#6374ae',
          '800': '#4a5989',
          '900': '#414e6e',
          '950': '#262c40',
        },
        primary: {
          '50': '#f5faff',
          '100': '#ebf5ff',
          '200': '#d6eaff',
          '300': '#b3d8ff',
          '400': '#80bfff',
          '500': '#4da6ff',
          '600': '#1a8dff',
          '700': '#006fd1',
          '800': '#0052a1',
          '900': '#003a73',
          '950': '#00264d',
        },
      },
    },
  },
  plugins: [],
};
export default config;
