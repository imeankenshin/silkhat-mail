import { logger } from 'nuxt/kit'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@pinia/nuxt',
    '@pinia/colada-nuxt'
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
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-04-02',
  hooks: {
    'nitro:init': async () => {
      // drizzle ORMのマイグレーションを自動実行
      try {
        const { migrate } = await import('drizzle-orm/node-postgres/migrator')
        const { drizzle } = await import('drizzle-orm/node-postgres')
        const { Pool } = await import('pg')
        const schema = await import('./server/database/schema')
        // データベース接続の設定
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL
        })
        const db = drizzle(pool, { schema })
        // マイグレーションの実行
        logger.info('Running database migrations...')
        await migrate(db, { migrationsFolder: './server/database/migrations' })
        logger.success('Database migrations completed successfully')
      }
      catch (error) {
        logger.error('Database migration failed:', error)
      }
      if (process.env.NODE_ENV !== 'development') return
      try {
        const { exec } = await import('child_process')
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
