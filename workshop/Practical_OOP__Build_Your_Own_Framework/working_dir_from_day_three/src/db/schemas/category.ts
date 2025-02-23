import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const CategoryTable = pgTable('categories', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
});
