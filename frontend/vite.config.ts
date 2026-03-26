import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/app": resolve(__dirname, "./src/app"),
      "@/shared": resolve(__dirname, "./src/shared"),
      "@/features": resolve(__dirname, "./src/features"),
      "@/layouts": resolve(__dirname, "./src/layouts"),
      "@/routing": resolve(__dirname, "./src/routing"),
    },
  },
  server: {
    port: 4001,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
