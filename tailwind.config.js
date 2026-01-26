/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import themes from 'daisyui/src/theming/themes.js';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'light-white': '#ffffff2b',
        'dark-grey': '#202123',
        'light-grey': '#353740',
      },
    },
    default: 'daisy',
  },
  daisyui: {
    darkTheme: 'dark',
    themes: [
      'light',
      'dark',
      {
        light: {
          ...themes['[data-theme=light]'],
          neutral: '#cbd5e1',
          'neutral-content': '#475569',
        },
        dark: {
          ...themes['[data-theme=dark]'],
          neutral: '#171c21',
          'neutral-content': '#94a3b8',
        },
      },
    ],
  },
  plugins: [daisyui],
};
