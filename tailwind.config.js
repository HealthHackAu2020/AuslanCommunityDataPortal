module.exports = {
  important: true,
  purge: ["./app/**/*.jsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      spacing: {
        "1x1": "100%",
        "3x2": "calc(100% * 2/3)",
        "16x9": "calc(100% * 9/16)",
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/custom-forms")],
};
