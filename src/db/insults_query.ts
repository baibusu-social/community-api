import type { UUID } from 'crypto'
import { db } from './db.js'
import { insultsTable } from './schema.js'
import { desc, eq, sql } from 'drizzle-orm'

export type NewInsult = {
  author: string;
  content: string
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