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
        pastel: {
          pink: '#FFAFBE',
          mint: '#9BD7B0',
          blue: '#94C1D7',
          lemon: '#FDFD96'
        }
      }
    },
  },
  plugins: [],
};
export default config;
