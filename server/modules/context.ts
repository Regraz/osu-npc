import { GraphQLError } from 'graphql'
import type { YogaInitialContext } from 'graphql-yoga'
import type { H3Event } from 'h3'

export async function createContext(
  initialContext: YogaInitialContext,
  event: H3Event,
) {
  let currentSessionCache: Awaited<ReturnType<typeof loadSession>> | null | undefined
  const currentSession = async () => {
    if (currentSessionCache === undefined) {
      currentSessionCache = await (async () => {
        try {
          return await loadSession()
        }
        catch (error) {
          // ignore
          return null
        }
      })()
    }
    return currentSessionCache
  }
  async function loadSession() {
    const sessionId = parseCookies(event).auth_session
    const session = await auth.validateSession(sessionId)
    // for type safety
    const user = (await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, session.user.userId),
    }))
    if (!user) {
      throw new GraphQLError('User not found')
    }
    return {
      sessionId,
      user,
    }
  }

  return {
    ...event.context,
    gql: initialContext,
    db,
    rawDatabase: sqlite,
    event,
    currentSession,
  }
}

export type GraphQLContext = Awaited<ReturnType<typeof createContext>>
