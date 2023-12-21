import type { Config } from 'drizzle-kit'

export default {
  schema: './server/modules/**/*.db.ts',
  out: './server/migrations',
  driver: 'libsql',
  dbCredentials: {
    url: './dev.sqlite',
  },
} satisfies Config
