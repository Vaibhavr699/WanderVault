/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{html,js,jsx,ts,tsx}',
    './components/**/*.{html,js,jsx,ts,tsx}',
    './src/**/*.{html,js,jsx,ts,tsx}', // Add other directories as needed
  ],
  theme: {
    fontFamily:{
      display:["Poppins", "sans-serif"],
    },
    extend: {
      //color used in the project
      colors:{
        primary: "#05B6D3",
        secondary: "#EF863E",
      },
      backgroundImage: {
        'login-bg-img': "url('./src/assets/images/bg-image.jpg')",
        'signup-bg-img': "url('./src/assets/images/sign-up.jpg')",
      },
    },
  },
  plugins: [],
}

