import SchemaBuilder from '@pothos/core'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import RelayPlugin from '@pothos/plugin-relay'
import ComplexityPlugin from '@pothos/plugin-complexity'

import { DateTimeResolver } from 'graphql-scalars'
import { GraphQLError } from 'graphql'
import type { GraphQLContext } from './context'

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: {
      Input: Date | string
      Output: Date | string
    }
  }
  AuthScopes: {
    auth: boolean
    isContestant: boolean
    isJudge: boolean
    isStaff: boolean
  }
  Context: GraphQLContext
}>({
  plugins: [ScopeAuthPlugin, RelayPlugin, ComplexityPlugin],
  authScopes: async ({ currentSession }) => {
    const session = await currentSession()
    const auth = !!session && !session.user.disabled
    const role = session?.user.role ?? []
    return {
      auth,
      isContestant: auth && role.includes('contestant'),
      isJudge: auth && role.includes('judge'),
      isStaff: auth && role.includes('staff'),
    }
  },
  scopeAuthOptions: {
    treatErrorsAsUnauthorized: true,
    unauthorizedError: () => new GraphQLError('Unauthorized'),
  },
  relayOptions: {
    // These will become the defaults in the next major version
    cursorType: 'String',
    clientMutationId: 'omit',
  },
  complexity: {
    defaultComplexity: 1,
    defaultListMultiplier: 5,
    limit: {
      complexity: 500,
      depth: 10,
      breadth: 50,
    },
  },
},
)
export type PothosBuilder = typeof builder

builder.addScalarType('Date', DateTimeResolver, {})

/**
 * Define schema
 * don't forget to use the exported in the schema
 */
export function defineResolver<T>(
  build: (builder: PothosBuilder) => T,
) {
  return () => build(builder)
}

export function defineEntity<T>(
  build: (builder: PothosBuilder) => T,
) {
  return build(builder)
}

// use builder.queryField, builder.mutationField, builder.subscriptionField to define fields
builder.queryType({})
builder.mutationType({})
// builder.subscriptionType({})
