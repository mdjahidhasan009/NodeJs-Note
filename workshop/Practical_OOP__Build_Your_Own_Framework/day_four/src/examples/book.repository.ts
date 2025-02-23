import { BookTable, NewBook, UpdateBook } from '@/db/schemas';
import db from '../db/connect';
import { PgColumn } from 'drizzle-orm/pg-core';
import { asc, desc, eq, ilike, or } from 'drizzle-orm';
import { BaseRepository } from '@/lib/core/BaseRepository';

export type FindOptions = {
	page?: number;
	limit?: number;
	orderBy?: string;
	orderDirection?: 'asc' | 'desc';
};

export class BookRepository {
	private readonly db = db;
	private readonly table = BookTable;

	findAll(options?: FindOptions) {
		const page = options?.page ?? 1;
		const limit = options?.limit ?? 10;
		const orderBy = options?.orderBy ?? 'createdAt';
		const orderDirection = options?.orderDirection ?? 'desc';

		const orderByColumn = this.table[
			orderBy as keyof typeof this.table
		] as PgColumn;

		const books = this.db.query.BookTable.findMany({
			limit,
			offset: (page - 1) * limit,
			orderBy:
				orderDirection === 'asc' ? asc(orderByColumn) : desc(orderByColumn),
			with: {
				author: true,
				genre: true,
				publisher: true,
			},
		});

		return books;
	}

	findById(id: string) {
		return this.db.query.BookTable.findFirst({
			where: eq(this.table.id, id),
			with: {
				author: true,
				genre: true,
				publisher: true,
			},
		});
	}

	search(options: FindOptions & { query: string }) {
		const page = options?.page ?? 1;
		const limit = options?.limit ?? 10;
		const orderBy = options?.orderBy ?? 'createdAt';
		const orderDirection = options?.orderDirection ?? 'desc';

		const orderByColumn = this.table[
			orderBy as keyof typeof this.table
		] as PgColumn;

		const books = this.db.query.BookTable.findMany({
			where: or(
				ilike(this.table.title, `%${options.query}%`),
				ilike(this.table.summary, `%${options.query}%`)
			),
			limit,
			offset: (page - 1) * limit,
			orderBy:
				orderDirection === 'asc' ? asc(orderByColumn) : desc(orderByColumn),
			with: {
				author: true,
				genre: true,
				publisher: true,
			},
		});

		return books;
	}

	create(data: NewBook) {
		return this.db.insert(this.table).values(data);
	}

	update(id: string, data: UpdateBook) {
		return this.db.update(this.table).set(data).where(eq(this.table.id, id));
	}

	delete(id: string) {
		return this.db.delete(this.table).where(eq(this.table.id, id));
	}
}

export class BookRepository2 extends BaseRepository<typeof BookTable> {}