import { builder, defineEntity } from '../pothos'
import { SongEntity } from '../song/song.entity'
import { VoteEntity } from '../vote/vote.entity'
import type { user } from './user.db'

export const UserRole = ['contestant', 'judge', 'staff'] as const

export const UserRoleEnum = builder.enumType('UserRole', {
  values: UserRole,
})

export const UserEntity = defineEntity((builder) => {
  const User = builder.objectRef<IUser>('User')
  User.implement({
    fields: t => ({
      id: t.exposeString('id'),
      name: t.exposeString('name', { nullable: true }),
      avatar: t.exposeString('avatar', { nullable: true }),
      disabled: t.exposeBoolean('disabled', { nullable: true }),
      voteSlots: t.exposeInt('voteSlots', { nullable: true }),

      role: t.field({
        type: [UserRoleEnum],
        resolve: root => root.role ?? [],
      }),

      votes: t.field({
        type: [VoteEntity],
        resolve: (root, _args, { db }) =>
          db.query.vote.findMany({
            where: (vote, { eq }) => eq(vote.userId, root.id),
          }),
      }),

      nominatedSongs: t.field({
        type: [SongEntity],
        resolve: (root, _args, { db }) =>
          db.query.song.findMany({
            where: (song, { eq }) => eq(song.nominatedByUserId, root.id),
          }),
      }),
    }),
  })

  return User
})

export type IUser = typeof user.$inferSelect
