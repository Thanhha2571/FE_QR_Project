/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'textColor': '#1f1f1f',
        'buttonColor1': '#00c5fb',
        'buttonColor2': '#55ce63',
        'placeholderTextColor': '#6c757d',
        'borderColor': '#808080'
      },

      fontFamily: {
        "Changa": ["Changa"],
        "DancingScript": ["Dancing Script"],
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}

