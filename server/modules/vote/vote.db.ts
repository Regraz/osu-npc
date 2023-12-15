import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { user } from '../user/user.db'
import { song } from '../song/song.db'

export const vote = sqliteTable('vote', {
  // the id of the user who voted
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),

  // the id of the song that was voted on
  songId: integer('song_id')
    .notNull()
    .references(() => song.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),

  createAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull(),
}, t => ({
  pk: primaryKey({ columns: [t.userId, t.songId] }),
}))

// relations
export const voteRelations = relations(vote, ({ one }) => ({
  user: one(user, {
    fields: [vote.userId],
    references: [user.id],
  }),
  song: one(song, {
    fields: [vote.songId],
    references: [song.id],
  }),
}))
