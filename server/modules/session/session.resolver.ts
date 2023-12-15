import { defineResolver } from '../pothos'

import { UserEntity } from '../user/user.entity'

export const useSessionResolver = defineResolver((builder) => {
  builder.queryField('me', t => t.field({
    type: UserEntity,
    nullable: true,
    resolve: async (_root, _args, { currentSession }) =>
      (await currentSession())?.user,
  }))

  builder.mutationField('logout', t => t.field({
    type: UserEntity,
    nullable: true,
    authScopes: { auth: true },
    resolve: async (_root, _args, { currentSession, event }) => {
      const authRequest = auth.handleRequest(event)
      await auth.invalidateSession((await currentSession())!.sessionId)
      authRequest.setSession(null)
      return null
    },
  }))
})
