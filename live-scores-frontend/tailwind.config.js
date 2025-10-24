// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066FF",     // 蓝色，运动感
        sportsGreen: "#00CC66", // 绿色，活力感
      },
    },
  },
  plugins: [],
};
