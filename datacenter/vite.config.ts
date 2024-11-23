import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dest_root, api_proxy_addr, img_proxy_addr } from './src/target_config';

export default defineConfig({
  base: dest_root,
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/datacenter-services': {
        target: api_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/datacenter-services/, ''),
      },
      '/img-proxy': {
        target: img_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, ''),
      },
    },
  },
  plugins: [react()],
});