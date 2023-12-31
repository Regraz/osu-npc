import { OAuthRequestError } from '@lucia-auth/oauth'
import type { H3Event } from 'h3'
import { Client } from 'osu-web.js'
import { updateProvider } from '~/server/modules/provider/provider.service'
import type { OsuUser } from '~/server/types/osu'

export default defineEventHandler(async (event) => {
  const storedState = getCookie(event, `osu_oauth_state`)
  const query = getQuery(event)
  const state = query.state?.toString() ?? ''
  const code = query.code?.toString()

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return oauthResponse(event, {
      state: 'error',
      error: 'Invalid request',
      errorCode: 400,
    })
  }

  try {
    const {
      getExistingUser,
      createUser,
      osuUser: osuRawUser,
      osuTokens,
    } = await osuAuth.validateCallback(code)
    const osuUser = osuRawUser as unknown as OsuUser // replace the old data type

    const authRequest = auth.handleRequest(event)

    const getUser = async () => {
      // if the user already registered, switch to it
      const existingUser = await getExistingUser()
      if (existingUser) {
        // update the user's name and avatar if it's changed
        if (existingUser.name !== osuUser.username || existingUser.avatar !== osuUser.avatar_url) {
          await auth.updateUserAttributes(existingUser.userId, {
            name: osuUser.username,
            avatar: osuUser.avatar_url,
          })
        }

        return existingUser
      }

      // else, create a new user
      const user = createUser({
        attributes: {
          name: osuUser.username,
          avatar: osuUser.avatar_url,
          vote_slots: 3,
        },
      })
      return user
    }

    const user = await getUser()
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    })
    authRequest.setSession(session)

    const keyId = `osu:${osuUser.id}`

    const osuClient = new Client(osuTokens.accessToken)
    const rankedMaps = await osuClient.users.getUserBeatmaps(osuUser.id, 'ranked')
    const guestMaps = await osuClient.users.getUserBeatmaps(osuUser.id, 'guest')
    const pendingMaps = await osuClient.users.getUserBeatmaps(osuUser.id, 'pending')
    const gravedMaps = await osuClient.users.getUserBeatmaps(osuUser.id, 'graveyard')

    const maps = [
      ...rankedMaps,
      ...guestMaps,
      ...pendingMaps,
      ...gravedMaps,
    ]

    await updateProvider(
      'osu',
      keyId,
      {
        ...osuUser,
        maps: maps.map(set => ({
          ...set,
          beatmaps: set.beatmaps.filter(beatmap =>
            beatmap.mode === 'osu'
            && beatmap.user_id === osuUser.id,
          ),
        })),
      },
    )

    // if the user join osu before 2023/12/1 and have a map, give 3 vote slots
    if (
      maps.length > 0
      && Date.parse(osuUser.join_date) < Date.parse('2023-12-01T00:00:00+08:00')
    ) {
      await auth.updateUserAttributes(user.userId, {
        vote_slots: 3,
      })
    }

    return oauthResponse(
      event,
      {
        state: 'success',
        user: {
          id: user.userId,
          name: user.name,
          avatar: user.avatar,
          voteSlots: user.voteSlots,
          role: JSON.parse(user.role as unknown as string ?? '[]') as string[],
          disabled: user.disabled,
        },
        provider: 'osu',
      },
    )
  }
  catch (e) {
    logger.error(e)
    if (e instanceof OAuthRequestError) {
      return oauthResponse(event, {
        state: 'error',
        error: 'Invalid code',
        errorCode: 400,
      })
    }
    return oauthResponse(event, {
      state: 'error',
      error: 'Unknown error',
      errorCode: 500,
    })
  }
})

function oauthResponse(
  event: H3Event,
  message: {
    state: 'success'
    user: {
      id: string
      name?: string | null | undefined
      avatar?: string | null | undefined
      voteSlots?: number | null | undefined
      role: string[]
      disabled?: boolean | null | undefined
    }
    provider: string
  } | {
    state: 'error'
    error: string
    errorCode: number
  },
) {
  const title = message.state === 'success'
    ? 'Welcome back'
    : 'Error'
  const text = message.state === 'success'
    ? 'You can close this window now.'
    : message.error

  if (message.state === 'error') {
    setResponseStatus(event, message.errorCode)
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #111;
              color: #fff;
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>${text}</p>
        <script>
          window.onload = function() {
            const message = JSON.parse('${JSON.stringify(message)}')
            const channel = new BroadcastChannel('oauth2-state')
            const msgId = Array.prototype.map.call(window.crypto.getRandomValues(new Uint8Array(16)), item => item.toString(16)).join('')
            channel.addEventListener('message', (event) => {
              if (event.data?.state === 'received' && event.data?.id === msgId) {
                window.close()
              }
            })
            channel.postMessage({
              ...message,
              id: msgId,
            })
            if (message.state === 'success') {
              setTimeout(() => {
                window.location.href='/'
              }, 1500)
            }
          }
        </script>
      </body>
    </html>
  `
}
