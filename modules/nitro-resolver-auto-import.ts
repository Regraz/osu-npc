import { writeFile } from 'node:fs/promises'
import { defineNuxtModule, useLogger } from '@nuxt/kit'
import { glob } from 'glob'
import path from 'pathe'

export interface NitroResolverAutoImportOptions {
  generates: {
    imports: string[]
    export: string
  }[]
}

// FIXME: this module not work when delete resolver
export default defineNuxtModule<NitroResolverAutoImportOptions>({
  meta: {
    name: '@teages/nuxt-nitro-resolver-auto-import',
    configKey: 'nitroResolverAutoImport',
  },
  setup(options, nuxt) {
    if (process.env.NODE_ENV === 'production') {
      return
    }
    nuxt.hook('nitro:build:before', async (nitro) => {
      options.generates.forEach((rule) => {
        const imoprted = new Set<string>()
        const rewrite = async () => {
          let updated = false

          const importsPath = rule.imports
            .map(p => glob.sync(p)).flat()
            .map(p => `./${path.relative(
                path.dirname(rule.export),
                p,
              )}`)
          // remove extension name
            .map(p => p.replace(/\.[^/.]+$/, ''))
          importsPath.forEach((p) => {
            if (!imoprted.has(p)) {
              imoprted.add(p)
              updated = true
            }
          })
          if (updated) {
            await writeFile(rule.export, `${[...imoprted].map(p => `export * from '${p}'`).join('\n')}\n`)
          }
        }
        nitro.hooks.hook('dev:reload', rewrite)
        rewrite()
      })
    })
  },
})
