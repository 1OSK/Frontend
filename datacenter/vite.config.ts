import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: '0.0.0.0', 
    port: 3000,
    proxy: {
      '/datacenter-services': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/datacenter-services/, '/datacenter-services'),
      },
    },
  },
  plugins: [react()],
  base: "/Frontend",
  logLevel: 'info',
  build: {
    outDir: 'dist', // Убедитесь, что путь для вывода правильный
  },
});