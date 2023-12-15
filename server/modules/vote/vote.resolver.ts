import { and, eq } from 'drizzle-orm'
import { GraphQLError } from 'graphql'
import { defineResolver } from '../pothos'
import { song } from '../song/song.db'
import { vote } from './vote.db'
import { VoteEntity } from './vote.entity'

export const useVoteResolver = defineResolver((builder) => {
  builder.mutationField('voteSong', t => t.field({
    type: VoteEntity,
    nullable: true,
    args: {
      songId: t.arg.id({ required: true }),
    },
    authScopes: { auth: true },
    resolve: async (_root, { songId }, { db, currentSession }) => {
      const session = (await currentSession())!

      const canVote = (await db.query.vote.findMany({
        where: (vote, { eq }) =>
          eq(vote.userId, session.user.id),
      })).length < (session.user.voteSlots ?? 0)

      if (!canVote) {
        throw new GraphQLError(`No vote slots left, you have used all ${session.user.voteSlots} slots.`)
      }

      try {
        const data = await db.insert(vote)
          .values({
            songId: Number.parseInt(songId.toString()),
            userId: session.user.id,
            createAt: new Date(),
          })
          .onConflictDoNothing()
          .returning()
        return data[0]
      }
      catch (e) {
        throw new GraphQLError('Song not found')
      }
    },
  }))

  builder.mutationField('unvoteSong', t => t.field({
    type: VoteEntity,
    nullable: true,
    args: {
      songId: t.arg.id({ required: true }),
    },
    authScopes: { auth: true },
    resolve: async (_root, { songId }, { db, currentSession }) => {
      const session = (await currentSession())!
      const data = await db.delete(vote)
        .where(
          and(
            eq(vote.songId, Number.parseInt(songId.toString())),
            eq(vote.userId, session.user.id),
          ),
        )
        .returning()

      return data[0]
    },
  }))

  builder.mutationField('nominateAndVoteSong', t => t.field({
    type: VoteEntity,
    nullable: true,
    args: {
      songTitle: t.arg.string({ required: true }),
      songArtist: t.arg.string({ required: true }),
      songUrl: t.arg.string({ required: true }),
    },
    authScopes: { auth: true },
    resolve: async (_root, songData, { db, currentSession }) => {
      const session = (await currentSession())!

      const canVote = (await db.query.vote.findMany({
        where: (vote, { eq }) =>
          eq(vote.userId, session.user.id),
      })).length < (session.user.voteSlots ?? 0)

      if (!canVote) {
        throw new GraphQLError(`No vote slots left, you have used all ${session.user.voteSlots} slots.`)
      }

      return await db.transaction(async (tx) => {
        // nominate song
        const newSong = await tx.insert(song)
          .values({
            title: songData.songTitle,
            artist: songData.songArtist,
            url: songData.songUrl,
          })
          .returning()
        if (newSong.length === 0) {
          tx.rollback()
          return
        }
        // vote song
        const newVote = await tx.insert(vote)
          .values({
            songId: newSong[0].id,
            userId: session.user.id,
            createAt: new Date(),
          })
          .returning()
        if (newVote.length === 0) {
          tx.rollback()
          return
        }
        return newVote[0]
      })
    },
  }))
})
