import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const tours = sqliteTable('tours', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  tagline: text().notNull(),
  description: text().notNull(),
  location: text().notNull(),
  duration: integer().notNull(),
  price: integer().notNull(),
  maxGuests: integer('max_guests').notNull(),
  imageUrl: text('image_url').notNull(),
  highlights: text().notNull(), // JSON array string
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const inquiries = sqliteTable('inquiries', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull(),
  tourId: integer('tour_id'),
  message: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const todos = sqliteTable('todos', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
