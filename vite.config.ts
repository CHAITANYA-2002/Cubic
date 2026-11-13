import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devServer from "@hono/vite-dev-server";
import cloudflareAdapter from "@hono/vite-dev-server/cloudflare";
import path from "path";

const root = import.meta.dirname;

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    // Dev only: /api/* is served by the same Hono app that runs on Cloudflare Pages Functions,
    // with D1 and secrets (.dev.vars) from wrangler's local platform proxy.
    ...(command === "serve"
      ? [
          devServer({
            entry: path.resolve(root, "server", "app.ts"),
            adapter: cloudflareAdapter({ proxy: { configPath: path.resolve(root, "wrangler.toml") } }),
            exclude: [/^(?!\/api(\/|\?|$)).*/],
            injectClientScript: false,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(root, "client", "src"),
      "@shared": path.resolve(root, "shared"),
      "@assets": path.resolve(root, "attached_assets"),
    },
  },
  root: path.resolve(root, "client"),
  build: {
    outDir: path.resolve(root, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 5000,
    strictPort: true,
    host: "0.0.0.0",
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
}));
