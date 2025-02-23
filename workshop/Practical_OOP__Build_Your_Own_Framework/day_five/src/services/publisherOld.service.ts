import db from '@/db/connect';
import { NewPublisher, UpdatePublisher, PublisherTable } from '@/db/schemas';
import { eq, ilike, and, SQL, sql } from 'drizzle-orm';

export const createPublisher = async (publisherData: NewPublisher) => {
	return db.insert(PublisherTable).values(publisherData).returning();
};

export const findPublisherById = async (id: string) => {
	const publishers = await db
		.select()
		.from(PublisherTable)
		.where(eq(PublisherTable.id, id))
		.limit(1);
	return publishers[0];
};

export const updatePublisher = async (id: string, updates: UpdatePublisher) => {
	return db
		.update(PublisherTable)
		.set({ ...updates, updatedAt: new Date() })
		.where(eq(PublisherTable.id, id))
		.returning();
};

export const deletePublisher = async (id: string) => {
	return db.delete(PublisherTable).where(eq(PublisherTable.id, id)).returning();
};

export const getPublishers = async (
	name?: string,
	page: number = 1,
	limit: number = 10
) => {
	const offset = (page - 1) * limit;
	const conditions: SQL[] = [];

	if (name) {
		conditions.push(ilike(PublisherTable.name, `%${name}%`));
	}

	const baseQuery = db.select().from(PublisherTable);
	const query =
		conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

	const [publishers, totalCount] = await Promise.all([
		query.limit(limit).offset(offset),
		db
			.select({ count: sql<number>`count(*)` })
			.from(PublisherTable)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.then((result) => Number(result[0].count)),
	]);

	const totalPages = Math.ceil(totalCount / limit);

	return {
		data: publishers,
		pagination: {
			currentPage: page,
			totalPages,
			totalItems: totalCount,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	};
};

export const searchPublishersByName = async (
	query: string,
	page: number = 1,
	limit: number = 10
) => {
	return getPublishers(query, page, limit);
};
