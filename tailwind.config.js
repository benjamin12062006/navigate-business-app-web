/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        paper: "#f4f5ef",
        ink: "#25382a",
        accent: "#6a8057",
        line: "#dfe4d7",
        action: "#263e2c",
        "action-hover": "#36553d",
        focus: "#688a50",
      },
      fontFamily: {
        sans: ["DMSans"],
        "body-medium": ["DMSansMedium"],
        "body-semibold": ["DMSansSemibold"],
        "body-bold": ["DMSansBold"],
        display: ["InstrumentSerifItalic"],
      },
    },
  },
  plugins: [],
};
