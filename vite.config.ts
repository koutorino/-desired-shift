import { resolve } from "path";
import { defineConfig } from "vite";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root,
  build: {
    outDir,
    rollupOptions: {
      input: {
        input: resolve(root, "input-form", "index.html"),
        result: resolve(root, "result", "index.html"),
        userEdit: resolve(root, "user-edit", "index.html"),
      },
    },
  },
});
