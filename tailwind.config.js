/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Paperlogy",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        cream: "#f8efe2",
        ivory: "#fff7ea",
        paper: "#fff8ed",
        linen: "#ead7bd",
        caramel: "#b17e4b",
        brown: "#6b4a35",
        coffee: "#543a2a",
        espresso: "#2f2119",
        matcha: "#66735b",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(83, 58, 42, 0.18)",
        warm: "inset 0 1px 0 rgba(255,255,255,.62), 0 24px 70px rgba(83,58,42,.10)",
        premium: "inset 0 1px 0 rgba(255,255,255,.7), 0 34px 110px rgba(83,58,42,.16)",
        "inner-warm": "inset 0 1px 0 rgba(255,255,255,.82), inset 0 -18px 60px rgba(177,126,75,.08)",
      },
    },
  },
  plugins: [],
};
