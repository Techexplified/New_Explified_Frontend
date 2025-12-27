/** @type {import('tailwindcss').Config} */

import { heroui } from "@heroui/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        minimal: {
          black: "#000000",
          white: "#FFFFFF",
          primary: "#23B5B5",
          gray: {
            50: "#FAFAFA",
            100: "#F5F5F5",
            200: "#EEEEEE",
            300: "#E0E0E0",
            400: "#BDBDBD",
            500: "#9E9E9E",
            600: "#757575",
            700: "#616161",
            800: "#424242",
            900: "#212121",
            950: "#0A0A0A",
          },
          dark: {
            100: "#1A1A1A",
            200: "#141414",
            300: "#0F0F0F",
            400: "#0A0A0A",
            500: "#050505",
          },
          heading: "#FFFFFF",
          paragraph: "#E0E0E0",
          muted: "#9E9E9E",
          border: "#424242",
          card: "#1A1A1A",
          cardHover: "#212121",
          background: "#000000",
          surface: "#0A0A0A",
          accent: "#08444F",
        },
      },
      keyframes: {
        typing: {
          "0%": { width: "0ch" },
          "100%": { width: "10ch" }, // 10 characters in "Let's Start"
        },
        typingLoop: {
          "0%, 10%": { width: "0ch" },
          "50%, 90%": { width: "10ch" },
        },
        splash: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        fadeInFromBottom: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        reverse_scroll: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.8)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        fadeOut: {
          "0%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        typing: "typing 2.5s steps(10) forwards", // smooth one-time typing
        typingLoop: "typingLoop 3.5s steps(10) infinite", // continuous loop
        splash: "splash 1s ease-out",
        gradient: "gradient 8s linear infinite",
        fadeInFromBottom: "fadeInFromBottom 0.5s ease-out",
        scroll: "scroll 30s linear infinite",
        reverse_scroll: "reverse_scroll 30s linear infinite",
        fadeIn: "fadeIn 1s ease-in-out",
        fadeOut: "fadeOut 1s ease-in-out",
        float: "float 3s ease-in-out infinite",
      },
      fontFamily: {
        maven: ["Maven Pro", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        unica: ["Unica One", "cursive"],
        bungee: ["Bungee Hairline", "cursive"],
        pacifico: ["Pacifico", "cursive"],
        englebert: ["Englebert", "cursive"],
        teko: ["Teko", "cursive"],
        breakbrush: ["BreakBrush", "sans-serif"],
      },
      screens: {
        xs: "400px", // Add a new 'xs' breakpoint
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "nextui",
      addCommonColors: false,
      defaultTheme: "dark",
      defaultExtendTheme: "light",
      layout: {},
      themes: {
        light: {
          layout: { background: "#FFFFFF", borderRadius: "8px" },
          colors: {
            primary: "#4ECCA3",
            background: "#FFFFFF",
            surface: "#F5F5F5",
            text: "#1E1E2C",
            textMuted: "#5A5A72",
            accent: "#FFD166",
            error: "#F25F5C",
            link: "#5692F2",
            success: "#3DBE29",
            warning: "#F59E0B",
            info: "#39A0ED",
          },
        },
        dark: {
          layout: { background: "#121117", borderRadius: "8px" },
          colors: {
            primary: "#4ECCA3",
            background: "#121117",
            surface: "#2A2A40",
            text: "#EAEAEA",
            textMuted: "#B5B5C3",
            accent: "#FFD166",
            error: "#F25F5C",
            link: "#5692F2",
            success: "#3DBE29",
            warning: "#F59E0B",
            info: "#39A0ED",
          },
        },
      },
    }),
  ],
};
