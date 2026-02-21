import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const tours = pgTable('tours', {
  id: serial().primaryKey(),
  name: text().notNull(),
  tagline: text().notNull(),
  description: text().notNull(),
  location: text().notNull(),
  duration: integer().notNull(),
  price: integer().notNull(),
  maxGuests: integer('max_guests').notNull(),
  imageUrl: text('image_url').notNull(),
  highlights: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const inquiries = pgTable('inquiries', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  tourId: integer('tour_id'),
  message: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
