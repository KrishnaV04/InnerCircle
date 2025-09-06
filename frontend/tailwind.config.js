/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ic: {
          bg: "#1a1a1a",
          surface: "#222222",
          border: "#3a3a3a",
          text: "#e5e7eb",
          muted: "#9ca3af",
          accent: "#d1d5db",
        },
      },
      borderRadius: {
        xl: "12px",
      },
    },
  },
  plugins: [],
};
