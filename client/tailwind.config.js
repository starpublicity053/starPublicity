// tailwind.config.js
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Define 'montserrat' to use the Montserrat font
        sans: ["HCo Gotham", "sans-serif"],
        script: ['"Dancing Script"', "cursive"], // Example using Google Fonts 'Dancing Script' or a generic cursive fallback
        arial: ["Arial", "sans-serif"],
        cursive: ["Outfit", "sans-serif"],
        cedarville: ['"Cedarville Cursive"', 'cursive'],
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out both",
        "slide-in-left": "slideInLeft 1s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideInLeft: {
          "0%": { opacity: 0, transform: "translateX(50px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [animate],
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
