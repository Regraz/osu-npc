import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

import * as dbSchema from '../modules/db-schema.generated'

import { logger as rawLogger } from './logger'

const logger = rawLogger.withTag('sql')

export const sqlite = new Database('dev.sqlite', {
  fileMustExist: true,
  verbose: process.dev ? logger.log : undefined,
})

export const db = drizzle(sqlite, {
  schema: dbSchema,
})
