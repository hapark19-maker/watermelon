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
          pink: '#FF8DA1',
          mint: '#75CE9F',
          blue: '#7BBCE0',
          lemon: '#FDFD96'
        }
      }
    },
  },
  plugins: [],
};
export default config;
