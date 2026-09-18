import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        'page-bridge': resolve(__dirname, 'src/inject/page-bridge.js')
      },
      output: {
        format: 'iife',
        entryFileNames: '[name].js',
      }
    },
    minify: 'terser',
    terserOptions: {
      mangle: { toplevel: true },
      compress: { drop_console: true, drop_debugger: true },
    }
  }
});
