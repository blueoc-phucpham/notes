import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "src/api/",
        "src/components/ui",
        "src/declarations.d.ts",
        "src/vite-env.d.ts",
        ".eslintrc.cjs",
        "postcss.config.js",
        "tailwind.config.js",
        "vite.config.ts"
      ],
    },
  },
});
