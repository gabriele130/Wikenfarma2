import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
<<<<<<< HEAD
=======
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
>>>>>>> 312fa3304dd9c8bb2a8e5461033ff6e0f5af0721

export default defineConfig({
  plugins: [
    react(),
<<<<<<< HEAD
  
=======
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
>>>>>>> 312fa3304dd9c8bb2a8e5461033ff6e0f5af0721
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
