// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#F87171', // red-400 for light mode
          dark: '#F43F5E',  // rose-500 for dark mode
        },
        surface: {
          light: '#ffffff',
          dark: '#1e293b', // slate-800
        },
        text: {
          light: '#1f2937', // gray-800
          dark: '#f1f5f9', // slate-100
        }
      }
    }
  }
};
