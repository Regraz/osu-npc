import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'gql',
    'server/migrations',
  ],
}, {
  rules: {
    'node/prefer-global/process': ['error', 'always'],
    'curly': ['error', 'all'],
  },
})
