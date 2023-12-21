import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

import * as dbSchema from '../modules/db-schema.generated'

const runtimeConfig = useRuntimeConfig()

export const sqlite = createClient(
  process.dev
    ? {
        url: 'file:dev.sqlite',
      }
    : {
        url: runtimeConfig.tursoUrl,
        authToken: runtimeConfig.tursoAuthToken,
      },
)

export const db = drizzle(sqlite, {
  schema: dbSchema,
})
