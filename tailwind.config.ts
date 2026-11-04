import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08090B",
        coal: "#101216",
        seam: "#1D2026",
        bone: "#EDEAE3",
        ash: "#9BA0A6",
        brass: "#C8A24B",
        harbor: "#31505F",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: { mega: "0.35em" },
    },
  },
  plugins: [],
};
export default config;
