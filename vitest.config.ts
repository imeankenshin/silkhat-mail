// vitest.config.ts
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineVitestConfig({
  test: {
    environment: "jsdom",
  },
});
