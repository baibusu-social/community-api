import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { z } from 'zod'
import { insultSchema, postInsultSchema, insultParamSchema, insultQuerySchema, insultsListSchema } from '../schema/insults.js'
import { getInsult, insertInsult, getInsultByID, deleteInsultByID, getInsultsPaginated } from '../db/insults_query.js'

const insults = new Hono()

const token = process.env.TOKEN ?? ''

// Error schema for reuse
const errorSchema = z.object({
  error: z.string(),
})

// Success message schema
const successSchema = z.object({
  message: z.string(),
})

// GET /insults - Get random insult
insults.get(
  '/insults',
  describeRoute({
    tags: ['Insults'],
    description: 'Get a random insult',
    responses: {
      200: {
        description: 'Successfully retrieved insult',
        content: {
          'application/json': { schema: resolver(insultSchema) },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    try {
      const insult = await getInsult()
      return c.json(insult, 200)
    } catch (error) {
      console.error('error fetching insult: ', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
)

// GET /insults/list - Get all insults with pagination, filtering, and sorting
insults.get(
  '/insults/list',
  describeRoute({
    tags: ['Insults'],
    description: 'Get all insults with pagination, filtering by author, and sorting',
    responses: {
      200: {
        description: 'Successfully retrieved insults',
        content: {
          'application/json': { schema: resolver(insultsListSchema) },
        },
      },
      400: {
        description: 'Bad request - invalid query parameters',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
    },
  }),
  validator('query', insultQuerySchema),
  async (c) => {
    try {
      const { page, limit, author, sortBy, sortOrder } = c.req.valid('query')
      const result = await getInsultsPaginated(page, limit, author, sortBy, sortOrder)
      return c.json(result, 200)
    } catch (error) {
      console.error('error fetching insults: ', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
)

// GET /insults/:id - Get insult by ID
insults.get(
  '/insults/:id',
  describeRoute({
    tags: ['Insults'],
    description: 'Get a specific insult by ID',
    responses: {
      200: {
        description: 'Successfully retrieved insult',
        content: {
          'application/json': { schema: resolver(insultSchema) },
        },
      },
      404: {
        description: 'Insult not found',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
      400: {
        description: 'Invalid ID format',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
    },
  }),
  validator('param', insultParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const insult = await getInsultByID(id)

      if (!insult) {
        return c.json({ error: 'Insult not found' }, 404)
      }

      return c.json(insult, 200)
    } catch (error) {
      console.error('error fetching insult by id: ', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
)

// POST /insults - Create new insult (protected)
insults.post(
  '/insults',
  bearerAuth({ token }), // Add bearer auth middleware
  describeRoute({
    tags: ['Insults'],
    description: 'Create a new insult (requires authentication)',
    security: [{ bearerAuth: [] }], // Document auth requirement in OpenAPI
    responses: {
      201: {
        description: 'Successfully created insult',
        content: {
          'application/json': { schema: resolver(postInsultSchema) },
        },
      },
      401: {
        description: 'Unauthorized - invalid or missing token',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
      400: {
        description: 'Bad request - validation failed',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
    },
  }),
  validator('json', postInsultSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')
      const createdInsult = await insertInsult(body)
      return c.json(createdInsult, 201)
    } catch (error) {
      console.error('error creating insult: ', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
)

// DELETE /insults/:id - Delete insult by ID (protected)
insults.delete(
  '/insults/:id',
  bearerAuth({ token }),
  describeRoute({
    tags: ['Insults'],
    description: 'Delete a specific insult by ID (requires authentication)',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully deleted insult',
        content: {
          'application/json': { schema: resolver(successSchema) },
        },
      },
      401: {
        description: 'Unauthorized - invalid or missing token',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
      404: {
        description: 'Insult not found',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
      400: {
        description: 'Invalid ID format',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: resolver(errorSchema),
          },
        },
      },
    },
  }),
  validator('param', insultParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const deletedInsult = await deleteInsultByID(id)

      if (!deletedInsult) {
        return c.json({ error: 'Insult not found' }, 404)
      }

      return c.json({ message: 'Insult successfully deleted' }, 200)
    } catch (error) {
      console.error('error deleting insult by id: ', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
)

export default insults