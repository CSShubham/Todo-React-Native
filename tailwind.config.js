/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [ "./App.{js,jsx,ts,tsx}",           // your main App file
    "./app/**/*.{js,jsx,ts,tsx}",      // all files in app folder
    "./components/**/*.{js,jsx,ts,tsx}"], // all component files
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}