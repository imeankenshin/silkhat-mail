// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // you can optionally set Nuxt-specific environment options
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
      }
    }
  }
})
