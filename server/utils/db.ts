import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../database/schema'

export { sql, eq, and, or } from 'drizzle-orm'

export const tables = schema

export function useDB() {
  const config = useRuntimeConfig(useEvent())
  const client = postgres(config.databaseUrl!, {
    prepare: false
  })
  return drizzle({ client, schema })
}
