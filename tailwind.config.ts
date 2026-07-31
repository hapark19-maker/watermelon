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
          pink: '#FFD1DC',
          mint: '#C1E1C1',
          blue: '#AEC6CF',
          lemon: '#FDFD96'
        }
      }
    },
  },
  plugins: [],
};
export default config;
