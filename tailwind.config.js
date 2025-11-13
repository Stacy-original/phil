/** @type {import('tailwindcss').Config} */
export default {
  content: ["./components/**/*.{js,vue,ts}",
    "./layout/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue", ],
  theme: {
    extend: {
      screens: {
        'max-sm' : {'max' : '480px'},
      },
    },
  },
  plugins: [],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {},
  },
  plugins: [],
}

