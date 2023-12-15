import { createYoga } from 'graphql-yoga'

import { schema } from '../modules'
import { createContext } from '../modules/context'

export default defineEventHandler((event) => {
  const { req, res } = event.node

  // Redirect to playground if the request is from a browser
  if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
    return sendRedirect(event, '/playground', 302)
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    return null
  }

  // Handle the graphql request
  const handler = createYoga({
    schema,
    context: initialContext => createContext(initialContext, event),
  })
  return handler(req, res)
})
