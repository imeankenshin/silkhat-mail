import { createRequire } from "module";
import path from "path";
import "./env";

const { resolve } = createRequire(import.meta.url);

const prismaClient = `prisma${path.sep}client`;

const prismaClientIndexBrowser = resolve(
  "@prisma/client/index-browser",
).replace(`@${prismaClient}`, `.${prismaClient}`);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-28',
  build: {
    transpile: ["trpc-nuxt"],
  },
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@prisma/nuxt",
    "@nuxt/icon",
    "@nuxt/test-utils",
    "@nuxthub/core",
  ],
  hub: {
    workers: true
  },
  eslint: {},
  css: ["@/assets/css/tailwind.css"],
  icon: {
    size: '1.5rem',
    collections: ['material-symbols', 'lucide', 'logos']
  },
  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser": path.relative(
          __dirname,
          prismaClientIndexBrowser,
        ),
      },
    },
    optimizeDeps: {
      include: ["vue"],
    },
    build: {
      commonjsOptions: {
        esmExternals: true,
      },
    },
  },
});
