import { defineConfig } from "vite";
import vue from "unplugin-vue/vite";
import vuetify from "vite-plugin-vuetify";
import { dirname, resolve } from "path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "../build/frontend/dist",
    emptyOutDir: true,
  },
  server: {
    port: 3030,
    proxy: {
      "/api": {
        target: "http://localhost:8088",
        changeOrigin: true,
      },
    },
  },
});
