import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/slide_me2/', // ต้องตรงกับ basename ใน BrowserRouter
  plugins: [react()],
});
