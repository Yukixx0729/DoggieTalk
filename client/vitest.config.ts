import { defineConfig } from "vitest/config";
///<reference types="vitest" />
///<reference types="vite/client" />

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
