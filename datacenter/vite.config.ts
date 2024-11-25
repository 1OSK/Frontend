import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { api_proxy_addr, img_proxy_addr, dest_root } from './target_config';  // Импортируем необходимые переменные

export default defineConfig({
  base: dest_root,  // Динамическое значение base для корректного пути
  server: {
    port: 3000,  // Порт разработки
    proxy: {
      '/datacenter-services': {
        target: api_proxy_addr,  // Прокси-адрес для API
        changeOrigin: true,       // Изменение заголовков при проксировании
        rewrite: (path) => path.replace(/^\/datacenter-services/, '/datacenter-services'),  // Оставляем префикс /datacenter-services в пути
      },
      '/img-proxy': {
        target: img_proxy_addr,  // Прокси-адрес для изображений
        changeOrigin: true,       // Изменение заголовков при проксировании
        rewrite: (path) => path.replace(/^\/img-proxy/, '/'),  // Оставляем префикс /img-proxy в пути
      },
    },
  },
  plugins: [react()],  // Плагин для работы с React
});