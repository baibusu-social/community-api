import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Scalar } from '@scalar/hono-api-reference'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { openAPIRouteHandler } from 'hono-openapi'
import 'dotenv/config'

import insultsRoute from './routes/insults.js'
import landing from './routes/landing.js'

const app = new Hono()

app.route('/', landing)

app.use(prettyJSON())
app.use(logger())

// OpenAPI spec endpoint
app.get(
  '/doc',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'Baibusu API',
        version: '1.0.0',
        description: 'API for fetching insults',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local Server' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'string',
          }
        }
      }
    },
  })
)

// Scalar API docs
app.get(
  '/docs',
  Scalar({
    url: '/doc',
    pageTitle: 'Baibusu API Docs',
    theme: 'laserwave',
  })
)

// Mount API routes
app.route('/api', insultsRoute)

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)