import db from '@/db/connect';
import { NewBookGenre, UpdateBookGenre, BookGenreTable } from '@/db/schemas';
import { eq, ilike, and, SQL, sql } from 'drizzle-orm';

export const createGenre = async (genreData: NewBookGenre) => {
	return db.insert(BookGenreTable).values(genreData).returning();
};

export const findGenreById = async (id: string) => {
	const genres = await db
		.select()
		.from(BookGenreTable)
		.where(eq(BookGenreTable.id, id))
		.limit(1);
	return genres[0];
};

export const updateGenre = async (id: string, updates: UpdateBookGenre) => {
	return db
		.update(BookGenreTable)
		.set({ ...updates, updatedAt: new Date() })
		.where(eq(BookGenreTable.id, id))
		.returning();
};

export const deleteGenre = async (id: string) => {
	return db.delete(BookGenreTable).where(eq(BookGenreTable.id, id)).returning();
};

export const getGenres = async (
	name?: string,
	page: number = 1,
	limit: number = 10
) => {
	const offset = (page - 1) * limit;
	const conditions: SQL[] = [];

	if (name) {
		conditions.push(ilike(BookGenreTable.name, `%${name}%`));
	}

	const baseQuery = db.select().from(BookGenreTable);
	const query =
		conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

	const [genres, totalCount] = await Promise.all([
		query.limit(limit).offset(offset),
		db
			.select({ count: sql<number>`count(*)` })
			.from(BookGenreTable)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.then((result) => Number(result[0].count)),
	]);

	const totalPages = Math.ceil(totalCount / limit);

	return {
		data: genres,
		pagination: {
			currentPage: page,
			totalPages,
			totalItems: totalCount,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	};
};

export const searchGenresByName = async (
	query: string,
	page: number = 1,
	limit: number = 10
) => {
	return getGenres(query, page, limit);
};
