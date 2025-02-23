import {
	integer,
	pgEnum,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { BookTable } from './book';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const UserRole = pgEnum('user_roles', ['admin', 'user']);
export const UserStatus = pgEnum('user_status', ['active', 'inactive']);

export const UsersTable = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	password: varchar('password', { length: 255 }).notNull(),
	role: UserRole('role').default('user'),
	status: UserStatus('status').default('active'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type User = typeof UsersTable.$inferSelect;

export const NewUserSchema = createInsertSchema(UsersTable).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type NewUser = z.infer<typeof NewUserSchema>;

export const UpdateUserSchema = createInsertSchema(UsersTable)
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	})
	.partial();

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const UserRelations = relations(UsersTable, ({ many }) => ({
	books: many(BookTable),
}));
