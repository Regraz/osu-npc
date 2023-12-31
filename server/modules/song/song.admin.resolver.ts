import { eq, inArray } from 'drizzle-orm'
import { defineResolver } from '../pothos'

import { SongEntity } from './song.entity'
import { song } from './song.db'

export const useAdminSongResolver = defineResolver((builder) => {
  builder.mutationField('removeSong', t => t.field({
    type: [SongEntity],
    args: {
      songIds: t.arg.idList({ required: true }),
    },
    resolve: async (_root, args, { db }) => {
      return await db.transaction(async (tx) => {
        const selectedSongs = await tx.delete(song)
          .where(
            inArray(song.id, args.songIds.map(id => Number.parseInt(id.toString()))),
          )
          .returning()

        return selectedSongs
      })
    },
  }))
})
