import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// gauravanand10.github.io is a GitHub Pages *user* site, so it is served from the domain root.
// If you ever move this to a project repo (e.g. /portfolio/), set BASE_PATH=/portfolio/ at build time.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
