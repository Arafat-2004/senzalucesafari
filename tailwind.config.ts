import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2D9B5E",
          "green-dark": "#1B5E3F",
          "green-light": "#4DB86F",
          "green-bg": "#E8F5E9",
          brown: "#3C2417",
          "brown-light": "#4A3728",
          gold: "#D4A017",
          "gold-light": "#D4B85C",
          cream: "#EEDFC4",
        },

        neutral: {
          white: "#FFFFFF",
          light: "#F5F5F5",
          gray: "#9E9E9E",
          dark: "#333333",
          darker: "#1A1410",
        },

        status: {
          success: "#4CAF50",
          "success-light": "#81C784",
          warning: "#FF9800",
          "warning-light": "#FFB74D",
          error: "#F44336",
          "error-light": "#EF5350",
          info: "#2196F3",
          "info-light": "#64B5F6",
          pending: "#D4A017",
        },

        text: {
          primary: "#333333",
          secondary: "#9E9E9E",
          disabled: "#CCCCCC",
          light: "#EEDFC4",
          "light-secondary": "#B9B680",
        },

        bg: {
          light: "#F5F5F5",
          card: "#FFFFFF",
          dark: "#3C2417",
          "dark-card": "#2B2B2B",
          "dark-light": "#4A3728",
        },

        border: {
          light: "#E0E0E0",
          dark: "#444444",
        },
      },

      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #2D9B5E 0%, #1B5E3F 100%)",
        "gradient-brand-bright": "linear-gradient(135deg, #2D9B5E 0%, #4DB86F 100%)",
        "gradient-hero-light": "linear-gradient(135deg, #E8F5E9 0%, #F5F5F5 100%)",
        "gradient-hero-dark": "linear-gradient(135deg, #3C2417 0%, #2B2B2B 100%)",
        "gradient-accent": "linear-gradient(135deg, #2D9B5E 0%, #D4A017 100%)",
      },

      boxShadow: {
        "green-glow": "0 0 15px rgba(45, 155, 94, 0.3)",
        "green-glow-dark": "0 0 15px rgba(45, 155, 94, 0.2)",
      },

      ringColor: {
        "brand-green": "#2D9B5E",
      },
    },
  },
  plugins: [],
};

export default config;
