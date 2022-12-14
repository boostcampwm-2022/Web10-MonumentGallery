import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { devRouter } from "./vite-devRouter.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devRouter([
      ["/create", "/create.html"],
      ["/gallery", "/gallery.html"],
      ["/gallery/*", "/gallery.html"],
    ]),
    react(),
    eslint(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        create: path.resolve(__dirname, "create.html"),
        gallery: path.resolve(__dirname, "gallery.html"),
      },
      // output: {
      //   manualChunks(id) {
      //     const chunks = ["axios", "react", "three", "zustand", "rapier"];
      //     if (id.includes("/node_modules")) {
      //       for (const chunkName of chunks) {
      //         if (id.includes(chunkName)) {
      //           return chunkName;
      //         }
      //       }
      //     }
      //   },
      // },
    },
    outDir: "../server/dist",
  },
});
