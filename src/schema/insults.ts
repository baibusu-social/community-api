import { z } from 'zod'

export const insultSchema = z.object({
  id: z.uuid(),
  author: z.string(),
  content: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const postInsultSchema = z.object({
  author: z.string().min(1, 'Author is required'),
  content: z.string().min(1, 'Content is required'),
})

export const insultParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
})

export const insultQuerySchema = z.object({
  page: z.coerce.number().int().positive('Page must be a positive integer').optional().default(1),
  limit: z.coerce.number().int().positive('Limit must be a positive integer').max(100, 'Limit cannot exceed 100').optional().default(10),
  author: z.string().optional(),
  sortBy: z.enum(['createdAt', 'author', 'content']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export const insultsListSchema = z.object({
  data: z.array(insultSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})