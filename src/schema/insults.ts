import { z } from 'zod'

export const randomInsultSchema = z.object({
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