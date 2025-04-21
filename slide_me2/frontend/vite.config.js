import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/slide_me2/',  // คงค่านี้ไว้
  server: {
    port: 5173
  }
})
