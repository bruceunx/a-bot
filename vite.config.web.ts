import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { join } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  root: join(__dirname, 'src/renderer'), // Point to your renderer folder
  base: '/',
  build: {
    outDir: '../../out/renderer' // Optional: matches electron-vite structure
  },
  resolve: {
    alias: {
      '@renderer': join(__dirname, 'src/renderer/src') // Adjust based on your folder structure
    }
  }
})
