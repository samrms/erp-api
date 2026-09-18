import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup/env.js"],
    globalSetup: ["./tests/setup/global-setup.js"],
    testTimeout: 15000,
    hookTimeout: 30000,
    pool: "forks",
    isolate: true,
  },
});
