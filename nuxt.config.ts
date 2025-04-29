import { logger } from 'nuxt/kit'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxthub/core',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    'shadcn-nuxt'
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
  build: {
    transpile: ['trpc-nuxt']
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-04-02',
  vite: {
    plugins: [tailwindcss()]
  },
  hooks: {
    'nitro:init': async () => {
      // drizzle ORMのマイグレーションを自動実行
      const { exec } = await import('child_process')
      try {
        // マイグレーションの実行
        // logger.info('Running database migrations...')
        // await migrate(db, { migrationsFolder: './server/database/migrations' })
        // logger.success('Database migrations completed successfully')
        logger.info('Running database migrations...')
        const migration = exec('pnpm drizzle-kit migrate')
        migration.on('exit', () => {
          logger.success('Database migrations completed successfully')
        })
        migration.on('error', (error) => {
          logger.error('Database migration failed:', error)
        })
      }
      catch (error) {
        logger.error('Database migration failed:', error)
      }
      if (process.env.NODE_ENV !== 'development') return
      try {
        const studio = exec('pnpm drizzle-kit studio')
        // kill studio on exit
        process.on('exit', () => {
          studio.kill()
        })
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
