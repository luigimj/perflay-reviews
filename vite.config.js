import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "index.html",
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    mimeTypes: {
      'application/javascript': ['js', 'mjs'],
    },
    watch: {
      usePolling: true,
    },
  },
});
