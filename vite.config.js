import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from '@rollup/plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      ...eslint({ include: '/src/**/*.+(js|ts|jsx|tsx)' }),
      enforce: 'pre'
    },
    react()
  ],
})
