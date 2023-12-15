import { readFile } from 'node:fs/promises'
import { defineNuxtModule, useLogger } from '@nuxt/kit'
import { generate } from '@graphql-codegen/cli'
import type { Types } from '@graphql-codegen/plugin-helpers'
import { glob } from 'glob'
import { resolve } from 'pathe'
import { hash } from 'ohash'

const logger = useLogger().withTag('graphql-codegen')

// Module options TypeScript interface definition
export interface CodegenOptions {
  config?: Types.Config
  debug: boolean
}

export default defineNuxtModule<CodegenOptions>({
  meta: {
    name: '@teages/nuxt-graphql-codegen',
    configKey: 'graphqlCodegen',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    debug: false,
  },
  setup(options, nuxt) {
    if (!options.config) {
      logger.error('No config provided for graphql-codegen')
      return
    }
    // const schema = options.config.schema
    const config: Types.Config = {
      ...options.config,
    }
    const documents = (Array.isArray(config.documents) ? config.documents : [config.documents]) as string[]

    const generateCode = async () => {
      // check if the schema exists
      if (config.schema) {
        const schemaPaths = Array.isArray(config.schema)
          ? config.schema
          : [config.schema]
        const schemaFiles = schemaPaths
          .flatMap(schemaPath => glob.sync(schemaPath.toString(), { absolute: true }))
        if (schemaFiles.length === 0) {
          logger.warn(`Schema file not found: ${schemaPaths.join(', ')}`)
          return
        }
      }

      const start = Date.now()
      await generate({
        ...config,
        silent: true,
      }, true)
      const time = Date.now() - start
      logger.success(`GraphQL code generated in ${time}ms`)
    }

    nuxt.hook('build:before', async () => {
      logger.start('Generating GraphQL code')
      await generateCode()
    })

    let lock: string | undefined
    nuxt.hook('builder:watch', async (event, path) => {
      const resolvedPath = resolve(path)

      // client side
      const files = documents
        .flatMap(doc => glob.sync(doc, { absolute: true }))
      if (files.includes(resolvedPath)) {
        const changedFile = await readFile(path, 'utf-8')
        if (!(changedFile.includes('graphql') || changedFile.includes('gql'))) {
          logger.info('GraphQL codegen skipped')
          return
        }

        const fileHash = hash(changedFile)
        if (lock === fileHash) {
          return
        }

        logger.start(`GraphQL code generating: ${path}`)
        lock = fileHash
        await generateCode()
        lock = undefined
        return
      }

      // schema
      const schemaPaths = config.schema
        ? Array.isArray(config.schema)
          ? config.schema
          : [config.schema]
        : []
      if (schemaPaths.some(schemaPath => resolve(schemaPath.toString()) === resolvedPath)) {
        logger.start(`GraphQL schema updated: ${path}`)
        await generateCode()
      }
    })
  },
})
