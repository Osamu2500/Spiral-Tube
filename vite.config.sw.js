import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        'service-worker': resolve(__dirname, 'src/background/index.ts')
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es'
      }
    },
    emptyOutDir: false,
    minify: 'terser',
    terserOptions: {
      mangle: {
        toplevel: true,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    modulePreload: { polyfill: false }
  }
});
