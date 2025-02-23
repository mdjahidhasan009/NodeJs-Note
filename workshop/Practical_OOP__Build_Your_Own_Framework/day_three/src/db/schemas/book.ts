import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { UsersTable } from './user';
import { relations } from 'drizzle-orm';

export const PublisherTable = pgTable('publishers', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Publisher = typeof PublisherTable.$inferSelect;
export type NewPublisher = typeof PublisherTable.$inferInsert;
export type UpdatePublisher = Partial<NewPublisher>;

export const BookGenreTable = pgTable('books_genre', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type BookGenre = typeof BookGenreTable.$inferSelect;
export type NewBookGenre = typeof BookGenreTable.$inferInsert;
export type UpdateBookGenre = Partial<NewBookGenre>;

export const BookStatus = pgEnum('book_status', [
	'draft',
	'published',
	'archived',
]);

export const BookTable = pgTable('books', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 255 }).notNull(),
	publisher: uuid('publisher_id').references(() => PublisherTable.id, {
		onDelete: 'set null',
	}),
	author: uuid('author_id').references(() => UsersTable.id, {
		onDelete: 'cascade',
	}),
	summary: text('summary').notNull(),
	status: BookStatus('status').default('draft'),
	pages: integer('pages').notNull(),
	genre: uuid('genre_id').references(() => BookGenreTable.id, {
		onDelete: 'set null',
	}),
	publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Book = typeof BookTable.$inferSelect;
export type NewBook = typeof BookTable.$inferInsert;
export type UpdateBook = Partial<NewBook>;

export const BookRelations = relations(BookTable, ({ one }) => ({
	author: one(UsersTable, {
		fields: [BookTable.author],
		references: [UsersTable.id],
	}),
	publisher: one(PublisherTable, {
		fields: [BookTable.publisher],
		references: [PublisherTable.id],
	}),
	genre: one(BookGenreTable, {
		fields: [BookTable.genre],
		references: [BookGenreTable.id],
	}),
}));

export const BookGenreRelations = relations(BookGenreTable, ({ many }) => ({
	books: many(BookTable),
}));

export const PublisherRelations = relations(PublisherTable, ({ many }) => ({
	books: many(BookTable),
}));
