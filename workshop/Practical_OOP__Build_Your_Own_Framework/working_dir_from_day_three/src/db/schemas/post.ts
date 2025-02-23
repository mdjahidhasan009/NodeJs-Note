import {
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import { UsersTable } from './user';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const PostStatus = pgEnum('post_status', [
    'draft',
    'published',
    'archived',
]);

export const PostTable = pgTable('posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    status: PostStatus('status').notNull().default('draft'),
    author: uuid('author').references(() => UsersTable.id, {
        onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Post = typeof PostTable.$inferSelect;

export const NewPostSchema = createInsertSchema(PostTable).omit({
    createdAt: true,
    updatedAt: true,
    status: true,
});

export type NewPost = z.infer<typeof NewPostSchema>;

export const UpdatePostSchema = NewPostSchema.partial()
    .omit({
        author: true,
        id: true,
    })
    .extend({
        status: z.enum(PostStatus.enumValues),
    })
    .partial();

export type UpdatePost = z.infer<typeof UpdatePostSchema>;