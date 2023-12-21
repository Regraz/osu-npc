import { DateTimeResolver } from 'graphql-scalars'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui',
    'nuxt-icon',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    dataValue: 'theme',
  },

  graphqlCodegen: {
    config: {
      schema: 'gql/schema.graphql',
      documents: [
        'composables/**/*.ts',
        '{pages, components}/**/*.vue',
      ],
      ignoreNoDocuments: true, // for better experience with the watcher
      generates: {
        './gql/': {
          preset: 'client',
          presetConfig: {
            fragmentMasking: false,
          },
          config: {
            useTypeImports: true,
            skipTypename: true,
            scalars: {
              Date: DateTimeResolver.extensions.codegenScalarType,
            },
          },
        },
      },
    },
  },

  nitroResolverAutoImport: {
    generates: [
      {
        imports: ['server/modules/**/*.resolver.ts'],
        export: 'server/modules/resolvers-import.generated.ts',
      },
      {
        imports: ['server/modules/**/*.db.ts'],
        export: 'server/modules/db-schema.generated.ts',
      },
    ],
  },

  runtimeConfig: {
    // osu, keep these empty and use env variables
    osuClientId: '',
    osuClientSecret: '',
    osuRedirectUri: '',

    // database
    tursoUrl: '',
    tursoAuthToken: '',

    public: {
      // state (NUXT_PUBLIC_RACE_STATE): 'preparation' | 'voting' | 'submitting' | 'rating' | 'result'
      raceState: 'voting',
    },
  },

  devtools: { enabled: true },
})
