/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'chat-bg': '#343541',
        'sidebar-bg': '#202123',
        'message-user': '#343541',
        'message-ai': '#444654',
      }
    },
  },
  plugins: [],
}
