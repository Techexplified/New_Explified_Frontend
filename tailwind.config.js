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
      willChange: {
        transform: "transform",
      },
      keyframes: {
        splash: {
          "0%": {
            transform: "scale(0)",
            opacity: "0.5",
          },
          "100%": {
            transform: "scale(4)",
            opacity: "0",
          },
        },
        gradient: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        fadeInFromBottom: {
          "0%": {
            opacity: 0,
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        scroll: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },
        reverse_scroll: {
          "0%": {
            transform: "translateX(-50%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: 0,
            transform: "scale(0.8)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
        fadeOut: {
          "0%": {
            opacity: 1,
            transform: "scale(1)",
          },
          "100%": {
            opacity: 0,
            transform: "scale(0.8)",
          },
        },
      },
      animation: {
        splash: "splash 1s ease-out",
        gradient: "gradient 8s linear infinite",
        fadeInFromBottom: "fadeInFromBottom 0.5s ease-out",
        scroll: "scroll 30s linear infinite",
        fadeIn: "fadeIn 1s ease-in-out",
        fadeOut: "fadeOut 1s ease-in-out",
        reverse_scroll: "reverse_scroll 30s linear infinite",
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
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "nextui", // prefix for theme variables
      addCommonColors: false, // avoid overriding common colors
      defaultTheme: "dark", // set dark as the default theme
      defaultExtendTheme: "light", // extend dark theme from light theme if needed
      layout: {}, // common layout tokens for all themes
      themes: {
        light: {
          layout: {
            // Optional layout tokens for light theme
            background: "#FFFFFF", // Page background
            borderRadius: "8px", // Rounded corners
          },
          colors: {
            // **Primary Colors**
            primary: "#4ECCA3", // Mint Green (same as dark theme)
            background: "#FFFFFF", // Pure White
            surface: "#F5F5F5", // Light Gray for cards and containers

            // **Text Colors**
            text: "#1E1E2C", // Deep Space Blue for main text
            textMuted: "#5A5A72", // Muted Gray for secondary text

            // **Accent Colors**
            accent: "#FFD166", // Golden Yellow for highlights
            error: "#F25F5C", // Soft Red for errors
            link: "#5692F2", // Sky Blue for links and interactive elements

            // **Feedback Colors**
            success: "#3DBE29", // Emerald Green for success states
            warning: "#F59E0B", // Amber Yellow for warnings
            info: "#39A0ED", // Azure Blue for informational states
          },
        },
        dark: {
          layout: {
            // Optional layout tokens for dark theme
            background: "#121117", // Page background
            borderRadius: "8px", // Rounded corners
          },
          colors: {
            // **Primary Colors**
            primary: "#4ECCA3", // Mint Green
            background: "#121117", // Deep Space Blue
            surface: "#2A2A40", // Charcoal Gray for cards and components

            // **Text Colors**
            text: "#EAEAEA", // Light Gray for main text
            textMuted: "#B5B5C3", // Muted Gray for secondary text

            // **Accent Colors**
            accent: "#FFD166", // Golden Yellow for highlights
            error: "#F25F5C", // Soft Red for errors
            link: "#5692F2", // Sky Blue for links and interactive elements

            // **Feedback Colors**
            success: "#3DBE29", // Emerald Green for success states
            warning: "#F59E0B", // Amber Yellow for warnings
            info: "#39A0ED", // Azure Blue for informational states
          },
        },
        // Add any additional themes here
      },
    }),
  ],
};
