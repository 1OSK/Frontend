import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/datacenter-services': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/datacenter-services/, '/datacenter-services'),
      },
    },
  },
  plugins: [react()],
  build: {
    outDir: 'dist', // Папка для сборки
    assetsDir: 'assets', // Папка для статичных файлов (изображений, шрифтов)
    sourcemap: true, // Генерация исходных карт для отладки
  },
});