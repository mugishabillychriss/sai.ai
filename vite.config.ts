
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This allows process.env.API_KEY to work in the browser, 
    // pulling from your local .env file or build environment
    'process.env': process.env
  },
  // If deploying to username.github.io/repo-name/, set base to '/repo-name/'
  base: './', 
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});
