import { integer, pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export const insultsTable = pgTable("insults", {
  id: uuid().primaryKey().defaultRandom(),
  author: varchar({ length: 255 }).notNull(),
  content: varchar({ length: 500 }).notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
})