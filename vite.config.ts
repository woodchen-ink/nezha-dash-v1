import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/v1/ws/server": {
        target: "ws://localhost:8080",
        changeOrigin: true,
        ws: true,
      },
      "/api/v1/": {
        target: "http://localhost:8008",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
