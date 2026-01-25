import type { UUID } from 'crypto'
import { db } from './db.js'
import { insultsTable } from './schema.js'
import { desc, eq, sql, asc, and, ilike } from 'drizzle-orm'

export type NewInsult = {
  author: string;
  content: string
}

export type PaginatedResult<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const insertInsult = async (insult: NewInsult) => {
  const [createdInsult] = await db.insert(insultsTable).values(insult).returning();

  return createdInsult
}

export const getInsult = async () => {
  const insult = await getRandomInsult()
  return insult
}

export const getInsultByID = async (id: string) => {
  const insult = await db
    .select()
    .from(insultsTable)
    .where(eq(insultsTable.id, id))
    .limit(1)

    return insult
}

export const deleteInsultByID = async (id: string) => {
  const [deletedInsult] = await db
    .delete(insultsTable)
    .where(eq(insultsTable.id, id))
    .returning();

  return deletedInsult;
}

async function getRandomInsult() {
  const randomInsult = await db
    .select()
    .from(insultsTable)
    .orderBy(sql`RANDOM()`)
    .limit(1)

  return randomInsult[0]
}

export const getInsultsPaginated = async (
  page: number = 1,
  limit: number = 10,
  author?: string,
  sortBy: 'createdAt' | 'author' | 'content' = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<PaginatedResult<typeof insultsTable.$inferSelect>> => {
  // Validate limit (max 100)
  const validLimit = Math.min(Math.max(limit, 1), 100)
  const validPage = Math.max(page, 1)
  const offset = (validPage - 1) * validLimit

  // Build where conditions
  const whereConditions = author
    ? and(ilike(insultsTable.author, `%${author}%`))
    : undefined

  // Determine sort column and order
  const sortColumn =
    sortBy === 'author' ? insultsTable.author :
    sortBy === 'content' ? insultsTable.content :
    insultsTable.createdAt

  const orderBy = sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn)

  // Fetch total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(insultsTable)
    .where(whereConditions)

  const total = countResult[0]?.count ?? 0
  const totalPages = Math.ceil(total / validLimit)

  // Fetch paginated data
  const data = await db
    .select()
    .from(insultsTable)
    .where(whereConditions)
    .orderBy(orderBy)
    .limit(validLimit)
    .offset(offset)

  return {
    data,
    total,
    page: validPage,
    limit: validLimit,
    totalPages,
  }
}