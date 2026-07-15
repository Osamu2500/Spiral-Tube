import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Separate build config for the Global Player Bar external bundle.
 * This IIFE is injected into non-YouTube sites via the second
 * content_scripts entry in manifest.json.
 *
 * Run: vite build --config vite.config.external.js
 */
export default defineConfig({
  esbuild: {
    jsx: 'preserve',
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        'global-bar-external': resolve(__dirname, 'src/content/entry/global-bar-external.js')
      },
      output: {
        entryFileNames: '[name].js',
        format: 'iife',
        inlineDynamicImports: true
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
