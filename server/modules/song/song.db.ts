import { relations } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { vote } from '../vote/vote.db'
import { user } from '../user/user.db'

export const songCategory = sqliteTable('song_category', {
  songId: integer('song_id')
    .notNull(),

  name: text('name', { enum: ['featured_artist', 'chosen'] })
    .notNull(),
}, t => ({
  pk: primaryKey({ columns: [t.songId, t.name] }),
}))

export const song = sqliteTable('song', {
  id: integer('id', { mode: 'number' })
    .primaryKey({ autoIncrement: true }),

  // the title of the song
  title: text('title')
    .notNull(),

  // the artist of the song
  artist: text('artist')
    .notNull(),

  // the url to the song
  url: text('url')
    .notNull(),

  // the user who nominated the song
  nominatedByUserId: text('nominated_by_user_id')
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
})

// relations
export const songRelations = relations(song, ({ many, one }) => ({
  votes: many(vote),
  categories: many(songCategory),
  nominatedBy: one(user, {
    fields: [song.nominatedByUserId],
    references: [user.id],
  }),
}))

export const songCategoryRelations = relations(songCategory, ({ one }) => ({
  song: one(song, {
    fields: [songCategory.songId],
    references: [song.id],
  }),
}))
