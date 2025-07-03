import { logger } from 'nuxt/kit'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxthub/core',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon'
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
    databaseUrl: ''
  },
  build: {
    transpile: ['trpc-nuxt']
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-04-02',
  nitro: {
    experimental: {
      asyncContext: true
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  hooks: {
    'nitro:init': async () => {
      // drizzle ORMのマイグレーションを自動実行
      const { spawn } = await import('child_process')
      const { performance } = await import('perf_hooks')
      try {
        // マイグレーションの実行
        // logger.info('Running database migrations...')
        // await migrate(db, { migrationsFolder: './server/database/migrations' })
        // logger.success('Database migrations completed successfully')
        const migration = spawn('pnpm', ['drizzle-kit', 'migrate'])
        process.on('exit', () => {
          migration.kill()
        })
        migration.on('spawn', () => {
          performance.mark('migration-start')
        })
        migration.on('exit', () => {
          performance.mark('migration-end')
          const migrationTime = performance.measure('migration', 'migration-start', 'migration-end')
          logger.success(`Database migrations completed in ${Math.round(migrationTime.duration)}ms`)
        })
        migration.on('error', (error) => {
          logger.error('Database migration failed:', error)
        })
      }
      catch (error) {
        logger.error('Database migration failed:', error)
      }
      if (!import.meta.dev) return
      try {
        const studio = spawn('pnpm', ['drizzle-kit', 'studio'])
        studio.on('spawn', () => {
          logger.info('Drizzle Studio started')
        })

        const cleanupStudio = () => {
          try {
            if (!studio.killed) {
              studio.kill()
            }
          }
          catch (error) {
            logger.error('Failed to kill studio process:', error)
          }
        }

        process.on('exit', cleanupStudio)
        process.on('SIGINT', cleanupStudio)
        process.on('SIGTERM', cleanupStudio)
      }
      catch (error) {
        logger.error('Drizzle Studio failed:', error)
      }
    }
  },
  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  }
})
