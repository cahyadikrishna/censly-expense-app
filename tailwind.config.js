/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        "dark-gray": "#333333",
        gray: "#666666",
        "light-gray": "#999999",
        "off-white": "#F9F9F9",
        background: "#FFFFFF",
        surface: "#F9F9F9",
        "accent-green": "#22C55E",
        "accent-red": "#EF4444",
        "notion-error": "#FF6B6B",
        "notion-success": "#4CAF50",
        "badge-success-bg": "#E8F5E9",
        "badge-success": "#4CAF50",
        "badge-error-bg": "#FFEBEE",
        "badge-error": "#FF6B6B",
        "badge-warning-bg": "#FFF8E1",
        "badge-warning": "#FFD93D",
      },
      boxShadow: {
        doodle: "4px 4px 2px rgba(0, 0, 0, 1), 0px 6px 3px rgba(0, 0, 0, 0.3)",
        "doodle-sm": "3px 3px 1px rgba(0, 0, 0, 0.5)",
        "doodle-lg": "6px 6px 3px rgba(0, 0, 0, 1), 0px 8px 4px rgba(0, 0, 0, 0.4)",
      },
      scale: {
        101: "1.01",
        102: "1.02",
        95: "0.95",
      },
      borderWidth: {
        3: "3px",
      },
      letterSpacing: {
        tight: "-0.02em",
        "tight-sm": "-0.01em",
      },
    },
  },
  plugins: [],
};
