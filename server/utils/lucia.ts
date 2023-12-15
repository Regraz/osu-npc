import { lucia } from 'lucia'
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite'
import { osu } from '@lucia-auth/oauth/providers'
import { h3 } from 'lucia/middleware'

import type { Beatmap, Beatmapset } from 'osu-web.js'
import type { OsuUser } from '../types/osu'
import { sqlite } from './database'
import { filterKeys, keysToCamelCase } from './object'

const runtimeConfig = useRuntimeConfig()

export const auth = lucia({
  adapter: betterSqlite3(sqlite, {
    user: 'user',
    session: 'user_session',
    key: 'user_key',
  }),

  env: process.dev ? 'DEV' : 'PROD',
  middleware: h3(),

  getUserAttributes: (data) => {
    const formatted = keysToCamelCase(data)
    return {
      ...filterKeys(formatted, [
        'id',
      ]),
      rawUser: formatted,
    }
  },

  getSessionAttributes: (data) => {
    const formatted = keysToCamelCase(data)
    return {
      ...filterKeys(formatted, [
        'id',
        'userId',
        'activeExpires',
        'idleExpires',
      ]),
    }
  },
})
export type Auth = typeof auth

// osu!
export const osuAuth = osu(auth, {
  clientId: runtimeConfig.osuClientId,
  clientSecret: runtimeConfig.osuClientSecret,
  redirectUri: runtimeConfig.osuRedirectUri,
  scope: [
    'identify',
    'public',
  ],
})
export type OsuProviderData = OsuUser & {
  maps: (Beatmapset & {
    beatmaps: (Beatmap & {
      checksum: string | null
    })[]
  })[]
}

// oauth2 provider data
export interface ProviderDataMap {
  osu: OsuProviderData
}
