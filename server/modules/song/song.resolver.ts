import { defineResolver } from '../pothos'

import { SongEntity } from './song.entity'

export const useSongResolver = defineResolver((builder) => {
  builder.queryField('songs', t => t.field({
    type: [SongEntity],
    resolve: async (_root, _args, { db }) =>
      await db.query.song.findMany(),
  }))
})
