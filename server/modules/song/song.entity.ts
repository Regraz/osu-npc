import { defineEntity } from '../pothos'
import { UserEntity } from '../user/user.entity'
import { VoteEntity } from '../vote/vote.entity'
import type { song } from './song.db'

export const SongEntity = defineEntity((builder) => {
  const Song = builder.objectRef<ISong>('Song')

  Song.implement({
    fields: t => ({
      id: t.exposeID('id'),
      title: t.exposeString('title'),
      artist: t.exposeString('artist'),
      url: t.exposeString('url'),

      categories: t.stringList({
        resolve: async (root, _args, { db }) => {
          const data = await db.query.songCategory.findMany({
            where: (songCategory, { eq }) => eq(songCategory.songId, root.id),
          })
          return data.map(d => d.name)
        },
      }),

      votes: t.field({
        type: [VoteEntity],
        resolve: async (root, _args, { db }) => {
          const data = await db.query.vote.findMany({
            where: (vote, { eq }) => eq(vote.songId, root.id),
          })
          return data
        },
      }),

      nominatedBy: t.field({
        type: UserEntity,
        nullable: true,
        resolve: async (root, _args, { db }) =>
          (await db.query.song.findFirst({
            where: (song, { eq }) => eq(song.id, root.id),
            columns: {},
            with: {
              nominatedBy: true,
            },
          }))?.nominatedBy,
      }),
    }),
  })

  return Song
})

export type ISong = typeof song.$inferSelect
