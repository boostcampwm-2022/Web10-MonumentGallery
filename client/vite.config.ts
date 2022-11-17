import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import {devRouter} from "./vite-devRouter.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devRouter([
      ["/create", "/create.html"],
      ["/myspace", "/myspace.html"],
    ]),
    react(),
    eslint(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        create: path.resolve(__dirname, "create.html"),
        myspace: path.resolve(__dirname, "myspace.html"),
      },
    },
    outDir: "../server/dist"
  },
});
