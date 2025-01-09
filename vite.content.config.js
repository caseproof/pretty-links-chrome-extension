import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    minify: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'content.js'),
        background: resolve(__dirname, 'background.js')
      },
      output: {
        format: 'iife',
        entryFileNames: '[name].js',
        extend: true
      }
    },
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: 'inline'
  }
});