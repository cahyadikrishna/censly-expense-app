/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#F5F5F5",
        "accent-green": "#22C55E",
        "accent-red": "#EF4444",
      },
    },
  },
  plugins: [],
};
