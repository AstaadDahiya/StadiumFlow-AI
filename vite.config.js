import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
});
