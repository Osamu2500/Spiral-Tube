import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  esbuild: {
    // Treat .js files as plain JS, not JSX — prevents `>` in template literals
    // from being misread as JSX closing tags during import analysis.
    jsx: 'preserve',
  },
  test: {
    exclude: ['scratch/**', 'node_modules/**']
  },
  build: {
    outDir: 'dist',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/entry/index.ts')
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: 'iife'
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
