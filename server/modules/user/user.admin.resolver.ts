import { eq } from 'drizzle-orm'
import { defineResolver } from '../pothos'
import { vote } from '../vote/vote.db'
import { user } from './user.db'

import { UserEntity, UserRoleEnum } from './user.entity'

export const useUserAdminResolver = defineResolver((builder) => {
  builder.queryField('user', t => t.field({
    type: UserEntity,
    nullable: true,
    authScopes: {
      auth: true,
      isStaff: true,
    },
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (_root, args, { db }) => {
      return await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.name, args.name),
      })
    },
  }))

  builder.mutationField('banUser', t => t.field({
    type: UserEntity,
    nullable: true,
    authScopes: {
      auth: true,
      isStaff: true,
    },
    args: {
      userId: t.arg.id({ required: true }),
    },
    resolve: async (_root, args) => {
      const userId = args.userId.toString()

      return await db.transaction(async (tx) => {
        const selectedUsers = await tx.update(user)
          .set({
            disabled: true,
          })
          .where(eq(user.id, userId))
          .returning()
        if (selectedUsers.length !== 1) {
          tx.rollback()
          return null
        }

        // remove all votes from this user
        await tx.delete(vote)
          .where(eq(vote.userId, userId))

        return selectedUsers[0]
      })
    },
  }))

  builder.mutationField('unbanUser', t => t.field({
    type: UserEntity,
    nullable: true,
    authScopes: {
      auth: true,
      isStaff: true,
    },
    args: {
      userId: t.arg.id({ required: true }),
    },
    resolve: async (_root, args) => {
      const userId = args.userId.toString()

      return await db.transaction(async (tx) => {
        const selectedUsers = await tx.update(user)
          .set({
            disabled: false,
          })
          .where(eq(user.id, userId))
          .returning()
        if (selectedUsers.length !== 1) {
          tx.rollback()
          return null
        }

        return selectedUsers[0]
      })
    },
  }))

  builder.mutationField('giveUserRole', t => t.field({
    type: UserEntity,
    nullable: true,
    authScopes: {
      auth: true,
      isStaff: true,
    },
    args: {
      userId: t.arg.id({ required: true }),
      role: t.arg({
        type: UserRoleEnum,
        required: true,
      }),
    },
    resolve: async (_root, args) => {
      const userId = args.userId.toString()

      return await db.transaction(async (tx) => {
        const selectedUser = await tx.query.user.findFirst({
          where: (user, { eq }) => eq(user.id, userId),
        })

        const oldRoles = selectedUser?.role ?? []

        const updatedUsers = await tx.update(user)
          .set({
            role: Array.from(new Set([...oldRoles, args.role])),
          })
          .returning()

        if (updatedUsers.length !== 1) {
          tx.rollback()
          return null
        }

        return updatedUsers[0]
      })
    },
  }))

  builder.mutationField('removeUserRole', t => t.field({
    type: UserEntity,
    nullable: true,
    authScopes: {
      auth: true,
      isStaff: true,
    },
    args: {
      userId: t.arg.id({ required: true }),
      role: t.arg({
        type: UserRoleEnum,
        required: true,
      }),
    },
    resolve: async (_root, args) => {
      const userId = args.userId.toString()

      return await db.transaction(async (tx) => {
        const selectedUser = await tx.query.user.findFirst({
          where: (user, { eq }) => eq(user.id, userId),
        })

        const oldRoles = selectedUser?.role ?? []

        const updatedUsers = await tx.update(user)
          .set({
            role: oldRoles.filter(r => args.role !== r),
          })
          .returning()

        if (updatedUsers.length !== 1) {
          tx.rollback()
          return null
        }

        return updatedUsers[0]
      })
    },
  }))
})
