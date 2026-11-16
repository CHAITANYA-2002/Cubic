import { defineConfig } from "vitest/config";

// Unit tests for pure server and shared logic. Kept apart from vite.config.ts, whose root is client/
// and which starts the Hono dev server.
export default defineConfig({
  test: {
    root: ".",
    include: ["server/**/*.test.ts", "shared/**/*.test.ts"],
    environment: "node",
  },
});
