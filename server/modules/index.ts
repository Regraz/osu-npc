import { resolve } from 'pathe'
import { printSchema } from 'graphql'
import { logger as rawLogger } from '../utils/logger'
import { builder } from './pothos'

import * as resolvers from './resolvers-import.generated'

export const schema = (() => {
  Object.values(resolvers).forEach(resolver => resolver())

  const schema = builder.toSchema()

  if (process.dev) {
    (async () => {
      const logger = rawLogger.withTag('gql')
      // auto write schema
      try {
        const schemaPath = resolve(process.cwd(), './gql/schema.graphql')
        const newContent = printSchema(schema)

        // check if the schema different
        const fs = (await import('node:fs')).promises
        const oldContent = await fs.readFile(schemaPath, 'utf-8').catch(() => null)

        if (oldContent !== newContent) {
          logger.info('Schema updated')
          await fs.writeFile(schemaPath, newContent)
        }
      }
      catch (error) {
        // ignore
        logger.info('failed to check schema')
      }
    })()
  }

  return schema
})()
