import db from '@/db/connect';
import { BookTable, NewBook, UpdateBook, Book } from '@/db/schemas/book';
import { eq, ilike, and, or, desc, asc, SQL, sql } from 'drizzle-orm';

export const createBook = async (bookData: NewBook) => {
	return db.insert(BookTable).values(bookData).returning();
};

export const findBookById = async (id: string) => {
	const books = await db
		.select()
		.from(BookTable)
		.where(eq(BookTable.id, id))
		.limit(1);
	return books[0];
};

export const updateBook = async (id: string, updates: UpdateBook) => {
	return db
		.update(BookTable)
		.set({ ...updates, updatedAt: new Date() })
		.where(eq(BookTable.id, id))
		.returning();
};

export const deleteBook = async (id: string) => {
	return db.delete(BookTable).where(eq(BookTable.id, id)).returning();
};

export type BookFilters = {
	title?: string;
	authorId?: string;
	publisherId?: string;
	genreId?: string;
	status?: Book['status'];
	sortBy?: keyof typeof BookTable._.columns;
	sortOrder?: 'asc' | 'desc';
};

export const getBooks = async (
	filters: BookFilters = {},
	page: number = 1,
	limit: number = 10
) => {
	const offset = (page - 1) * limit;
	const conditions: SQL[] = [];

	if (filters.title) {
		conditions.push(ilike(BookTable.title, `%${filters.title}%`));
	}
	if (filters.authorId) {
		conditions.push(eq(BookTable.author, filters.authorId));
	}
	if (filters.publisherId) {
		conditions.push(eq(BookTable.publisher, filters.publisherId));
	}
	if (filters.genreId) {
		conditions.push(eq(BookTable.genre, filters.genreId));
	}
	if (filters.status) {
		conditions.push(eq(BookTable.status, filters.status));
	}

	const baseQuery = db.select().from(BookTable);

	const query =
		conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

	const finalQuery = filters.sortBy
		? query.orderBy(
				filters.sortOrder === 'desc'
					? desc(BookTable[filters.sortBy])
					: asc(BookTable[filters.sortBy])
		  )
		: query;

	const [books, totalCount] = await Promise.all([
		finalQuery.limit(limit).offset(offset),
		db
			.select({ count: sql<number>`count(*)` })
			.from(BookTable)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.then((result) => Number(result[0].count)),
	]);

	const totalPages = Math.ceil(totalCount / limit);

	return {
		data: books,
		pagination: {
			currentPage: page,
			totalPages,
			totalItems: totalCount,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	};
};

export const searchBooksByTitle = async (
	query: string,
	page: number = 1,
	limit: number = 10
) => {
	return getBooks({ title: query }, page, limit);
};

export const getBooksByAuthor = async (
	authorId: string,
	page: number = 1,
	limit: number = 10
) => {
	return getBooks({ authorId }, page, limit);
};

export const getBooksByPublisher = async (
	publisherId: string,
	page: number = 1,
	limit: number = 10
) => {
	return getBooks({ publisherId }, page, limit);
};

export const getBooksByGenre = async (
	genreId: string,
	page: number = 1,
	limit: number = 10
) => {
	return getBooks({ genreId }, page, limit);
};

export const updateBookStatus = async (id: string, status: Book['status']) => {
	return db
		.update(BookTable)
		.set({ status, updatedAt: new Date() })
		.where(eq(BookTable.id, id))
		.returning();
};

export const getPublishedBooks = async (
	page: number = 1,
	limit: number = 10
) => {
	return getBooks({ status: 'published' }, page, limit);
};
