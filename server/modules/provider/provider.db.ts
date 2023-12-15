import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { relations } from 'drizzle-orm'
import { userKey } from '../user/user.db'

export const provider = sqliteTable('provider', {
  keyId: text('key_id')
    .primaryKey()
    .references(() => userKey.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),

  providerId: text('provider_id')
    .notNull(),

  data: text('data', { mode: 'json' })
    .$type<unknown>()
    .notNull(),

  updateAt: integer('update_at', { mode: 'timestamp_ms' })
    .notNull(),
})

// relations
export const providerRelations = relations(provider, ({ one }) => ({
  key: one(userKey, {
    fields: [provider.keyId],
    references: [userKey.id],
  }),
}))
