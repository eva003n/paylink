import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

console.log(path.resolve(__dirname, "../shared"));
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    // alias: {
    //   "@": path.resolve(__dirname, "src"),
    //   "@shared": path.resolve(__dirname, "../shared")
    // },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api", "/api/v1")
      },
    },
    fs: {
      allow: [".."] // allow access outside root(frontend dir)
    }
  },
});
