import { defineEntity } from '../pothos'
import { SongEntity } from '../song/song.entity'
import { UserEntity } from '../user/user.entity'
import type { vote } from './vote.db'

export const VoteEntity = defineEntity((builder) => {
  const Vote = builder.objectRef<IVote>('Vote')

  Vote.implement({
    fields: t => ({
      createAt: t.expose('createAt', {
        type: 'Date',
      }),

      user: t.field({
        type: UserEntity,
        resolve: async (root, _args, { db }) =>
          (await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, root.userId),
          }))!, // limited by database
      }),

      song: t.field({
        type: SongEntity,
        resolve: async (root, _args, { db }) =>
          (await db.query.song.findFirst({
            where: (song, { eq }) => eq(song.id, root.songId),
          }))!, // limited by database
      }),
    }),
  })

  return Vote
})

export type IVote = typeof vote.$inferSelect
