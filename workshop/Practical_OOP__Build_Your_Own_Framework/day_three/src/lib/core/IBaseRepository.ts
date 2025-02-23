import { SQLWrapper } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';

export type ID = string | number;

export type OrderDirection = 'asc' | 'desc';

export type FindOptionsSQL = {
	where?: SQLWrapper;
	limit?: number;
	offset?: number;
	orderBy?: {
		column: PgColumn;
		direction: OrderDirection;
	}[];
};

////TODO: have to check inferSelect and inferInsert

export interface IBaseRepository<TTable extends PgTable & { id: SQLWrapper }> { ////TODO: have to check why string | number will not work for id
	// Queries
	findAll(options?: FindOptionsSQL): Promise<TTable['$inferSelect'][]>;
	findById(id: ID): Promise<TTable['$inferSelect'] | null>;
	findOne(where: SQLWrapper): Promise<TTable['$inferSelect'] | null>;
	findAndCount(
		options?: FindOptionsSQL
	): Promise<[TTable['$inferSelect'][], number]>;

	count(where?: SQLWrapper): Promise<number>;
	checkExists(where: SQLWrapper): Promise<boolean>;

	// Mutations: Create
	create(data: TTable['$inferInsert']): Promise<TTable['$inferSelect']>;
	createMany(data: TTable['$inferInsert'][]): Promise<TTable['$inferSelect'][]>;

	// Mutations: Update
	update(
		id: ID,
		data: Partial<TTable['$inferInsert']>
	): Promise<TTable['$inferSelect'] | null>;
	updateMany(
		data: (Partial<TTable['$inferInsert']> & { id: ID })[]
	): Promise<TTable['$inferSelect'][]>;

	// Mutations: Delete
	delete(id: ID): Promise<void>;
	deleteMany(ids: ID[]): Promise<void>;
}
