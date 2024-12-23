import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['axios'],
  },
  server: {
    proxy: {
      '/eguard': {
        target: process.env.VITE_API_HOST,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/eguard/, '/eguard'),
      },
    },
  },
});