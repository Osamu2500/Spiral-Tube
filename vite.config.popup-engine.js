import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        'popup-engine': resolve(__dirname, 'src/content/features/popup-player/engine/index.js')
      },
      output: {
        format: 'iife',
        entryFileNames: '[name].js',
      }
    },
    minify: 'terser',
    terserOptions: {
      mangle: { toplevel: true },
      compress: { drop_console: false, drop_debugger: true },
    }
  }
});
