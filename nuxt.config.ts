import tailwindcss from '@tailwindcss/vite'
import { unctxPlugin } from 'unctx/plugin'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxthub/core',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@sentry/nuxt/module'
  ],

  devtools: {
    enabled: true,
    customTabs: [
      {
        name: 'Database',
        icon: 'carbon:db2-database',
        title: 'Database',
        category: 'server',
        view: {
          type: 'iframe',
          src: 'https://local.drizzle.studio'
        }
      }
    ]
  },

  css: ['~/assets/main.css'],

  colorMode: {
    storage: 'localStorage',
    classSuffix: ''
  },

  runtimeConfig: {
    googleClientId: '',
    googleClientSecret: '',
    googleRedirectUrl: '',
    databaseUrl: '',
    betterAuthSecret: ''
  },

  build: {
    transpile: ['trpc-nuxt']
  },

  sourcemap: {
    client: 'hidden'
  },

  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-04-02',

  nitro: {
    experimental: {
      asyncContext: true
    }
  },

  vite: {
    plugins: [tailwindcss(), unctxPlugin.vite({})]
  },

  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: 'silkhat',
      project: 'silkhat-mail'
    }
  }
})
