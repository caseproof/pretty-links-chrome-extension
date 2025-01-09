import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, "core-files/background/background.js"),
        content: resolve(__dirname, "core-files/content/content.js"),
        popup: resolve(__dirname, "core-files/popup.html"),
        options: resolve(__dirname, "core-files/options.html"),
        styles: resolve(__dirname, "core-files/styles.css")
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background/[name].js';
          }
          if (chunkInfo.name === 'content') {
            return 'content/[name].js';
          }
          return '[name].js';
        },
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: 'inline'
  }
});