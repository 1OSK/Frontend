import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/datacenter-services': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/datacenter-services/, '/datacenter-services'), // сохраняем путь без изменений
      },
    },
  },
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/Frontend/' : '/',
});