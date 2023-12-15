import { relations } from 'drizzle-orm'
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { vote } from '../vote/vote.db'
import { provider } from '../provider/provider.db'
import { song } from '../song/song.db'
import type { UserRole } from './user.entity'

export const user = sqliteTable('user', {
  id: text('id')
    .primaryKey(),

  name: text('name')
    .notNull(),

  avatar: text('avatar')
    .notNull(),

  role: text('role', { mode: 'json' })
    .$type<(typeof UserRole[number])[]>(),

  disabled: integer('disabled', { mode: 'boolean' }),

  voteSlots: integer('vote_slots'),
})
export type DatabaseUser = KeysToSnakeCase<typeof user.$inferInsert>

// lucia required
export const userSession = sqliteTable('user_session', {
  id: text('id')
    .primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),

  activeExpires: blob('active_expires', {
    mode: 'bigint',
  }).notNull(),

  idleExpires: blob('idle_expires', {
    mode: 'bigint',
  }).notNull(),
})
export type DatabaseUserSession = KeysToSnakeCase<typeof userSession.$inferInsert>

export const userKey = sqliteTable('user_key', {
  id: text('id')
    .primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),

  hashedPassword: text('hashed_password'),
})
export type DatabaseUserKey = typeof userKey.$inferInsert

// relations
export const userRelation = relations(user, ({ many }) => ({
  keys: many(userKey),
  votes: many(vote),
  nominatedSongs: many(song),
}))
export const userKeyRelation = relations(userKey, ({ one, many }) => ({
  user: one(user, {
    fields: [userKey.userId],
    references: [user.id],
  }),
  providers: many(provider),
}))
