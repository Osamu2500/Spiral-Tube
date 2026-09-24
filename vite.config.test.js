import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        test: resolve(__dirname, 'src/popup/scripts/core/popup-main.js')
      }
    }
  }
});
