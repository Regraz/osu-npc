import type { QueryAuthStateQuery } from '~/gql/graphql'

const query = gql(`
  query queryAuthState {
    me {
      id
      name
      avatar
      role
      disabled
      voteSlots
    }
  }
`)

const mutation = gql(`
  mutation logout {
    logout {
      id
      name
      avatar
      role
      disabled
      voteSlots
    }
  }
`)

export function useAuthWritable() {
  const user = useState<User | null>('user', () => null)
  const state = useState('auth-state', () => false)

  const auth = computed<ClientAuthData>(() => {
    const stateValue = unref(state)
    if (!stateValue) {
      return {
        state: 'pending',
      }
    }

    const userValue = unref(user)
    if (!userValue) {
      return {
        state: 'unauthenticated',
        user: null,
      }
    }

    return {
      state: 'authenticated',
      user: userValue,
    }
  })

  const load = (userData?: User) => {
    if (!userData) {
      user.value = null
      state.value = true
      return
    }
    user.value = userData
    state.value = true
  }

  const refresh = async () => {
    const data = await useQuery(query)
    load(data?.me ?? undefined)
  }

  const logout = async () => {
    const data = await useMutation(mutation)
    load(data?.logout ?? undefined)
  }

  const expect = async (isAuthenticated: boolean) => {
    if (process.server) {
      const cookie = useCookie('auth_session')
      if (!cookie.value && !isAuthenticated) {
        return true
      }
      return null
    }

    await until(state).toBe(true)
    return auth.value.state === (isAuthenticated ? 'authenticated' : 'unauthenticated')
  }

  const readonlyUser = computed(() => {
    if (auth.value.state === 'authenticated') {
      return auth.value.user
    }
    return null
  })

  return { user: readonlyUser, auth, refresh, load, expect, logout }
}

export function useAuth() {
  const authWritable = useAuthWritable()
  return {
    auth: authWritable.auth,
    user: authWritable.user,
    expect: authWritable.expect,
  }
}

export function useOAuthChannel() {
  const lastChannelData = useState<OAuthCallbackData | null>('oauth2-state', () => null)
  const listening = useState('oauth2-state-listening', () => false)

  if (!listening.value) {
    const { data: rawData, post } = useBroadcastChannel<OAuthCallbackData, OAuthCallbackDataReceived>({ name: 'oauth2-state' })
    watch(rawData, (data) => {
      if (data) {
        if (['success', 'error'].includes(data.state)) {
          lastChannelData.value = data
          if (data.id) {
            post({
              id: data.id,
              state: 'received',
            })
          }
        }
      }
    })
  }

  return lastChannelData
}

type User = NonNullable<QueryAuthStateQuery['me']>

export type OAuthCallbackData = (
  OAuthCallbackDataSuccess | OAuthCallbackDataError | OAuthCallbackDataReceived
) & { id?: string }
interface OAuthCallbackDataSuccess {
  state: 'success'
  user: User
  provider: string
}
interface OAuthCallbackDataError {
  state: 'error'
  error: string
  errorCode: string
}
interface OAuthCallbackDataReceived {
  state: 'received'
  id: string
}

interface ClientAuthDataPending {
  state: 'pending'
}
interface ClientAuthDataAuthenticated {
  state: 'authenticated'
  user: User
}
interface ClientAuthDataUnauthenticated {
  state: 'unauthenticated'
  user: null
}
type ClientAuthData = ClientAuthDataPending | ClientAuthDataAuthenticated | ClientAuthDataUnauthenticated
