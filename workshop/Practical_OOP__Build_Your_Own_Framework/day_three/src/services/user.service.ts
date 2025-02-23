import bcrypt from 'bcryptjs';
import { asc, desc, eq, ilike } from 'drizzle-orm';
import db from '@/db/connect';
import { NewUser, UsersTable } from '@/db/schemas/user';

export const createAdminUser = async (data: NewUser) => {
	const hashedPassword = await bcrypt.hash(data.password, 10);
	return db
		.insert(UsersTable)
		.values({
			...data,
			password: hashedPassword,
			role: 'admin',
		})
		.returning();
};

export const createRegularUser = async (data: NewUser) => {
	const hashedPassword = await bcrypt.hash(data.password, 10);
	return db
		.insert(UsersTable)
		.values({
			...data,
			password: hashedPassword,
			role: 'user',
		})
		.returning();
};

export const findUserById = async (id: string) => {
	return db.query.UsersTable.findFirst({
		where: eq(UsersTable.id, id),
	});
};

export const findUserByEmail = async (email: string) => {
	return db.query.UsersTable.findFirst({
		where: eq(UsersTable.email, email),
	});
};

// Bad practice: Separate functions for similar queries
export const findActiveUsers = async (
	page: number = 1,
	limit: number = 10,
	sortBy: 'name' | 'email' | 'createdAt' = 'createdAt',
	sortOrder: 'asc' | 'desc' = 'desc'
) => {
	const offset = (page - 1) * limit;
	return db.query.UsersTable.findMany({
		where: eq(UsersTable.status, 'active'),
		limit,
		offset,
		orderBy:
			sortOrder === 'desc' ? desc(UsersTable[sortBy]) : asc(UsersTable[sortBy]),
	});
};

export const findInactiveUsers = async (
	page: number = 1,
	limit: number = 10,
	sortBy: 'name' | 'email' | 'createdAt' = 'createdAt',
	sortOrder: 'asc' | 'desc' = 'desc'
) => {
	const offset = (page - 1) * limit;
	return db.query.UsersTable.findMany({
		where: eq(UsersTable.status, 'inactive'),
		limit,
		offset,
		orderBy:
			sortOrder === 'desc' ? desc(UsersTable[sortBy]) : asc(UsersTable[sortBy]),
	});
};

// Bad practice: Duplicate search logic
export const searchUsersByName = async (
	searchTerm: string,
	page: number = 1,
	limit: number = 10
) => {
	const offset = (page - 1) * limit;
	return db.query.UsersTable.findMany({
		where: ilike(UsersTable.name, `%${searchTerm}%`),
		limit,
		offset,
		orderBy: desc(UsersTable.createdAt),
	});
};

export const searchUsersByEmail = async (
	searchTerm: string,
	page: number = 1,
	limit: number = 10
) => {
	const offset = (page - 1) * limit;
	return db.query.UsersTable.findMany({
		where: ilike(UsersTable.email, `%${searchTerm}%`),
		limit,
		offset,
		orderBy: desc(UsersTable.createdAt),
	});
};

// Bad practice: Separate update functions for each field
export const updateUserName = async (id: string, name: string) => {
	return db
		.update(UsersTable)
		.set({ name, updatedAt: new Date() })
		.where(eq(UsersTable.id, id))
		.returning();
};

export const updateUserEmail = async (id: string, email: string) => {
	return db
		.update(UsersTable)
		.set({ email, updatedAt: new Date() })
		.where(eq(UsersTable.id, id))
		.returning();
};

export const updateUserPassword = async (id: string, password: string) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	return db
		.update(UsersTable)
		.set({ password: hashedPassword, updatedAt: new Date() })
		.where(eq(UsersTable.id, id))
		.returning();
};

export const updateUserStatus = async (
	id: string,
	status: 'active' | 'inactive'
) => {
	return db
		.update(UsersTable)
		.set({ status, updatedAt: new Date() })
		.where(eq(UsersTable.id, id))
		.returning();
};

// Bad practice: Multiple delete functions
export const softDeleteUser = async (id: string) => {
	return db
		.update(UsersTable)
		.set({ status: 'inactive', updatedAt: new Date() })
		.where(eq(UsersTable.id, id))
		.returning();
};

export const permanentlyDeleteUser = async (id: string) => {
	return db.delete(UsersTable).where(eq(UsersTable.id, id)).returning();
};

export const bulkDeleteUsers = async (ids: string[]) => {
	const deletePromises = ids.map((id) =>
		db.delete(UsersTable).where(eq(UsersTable.id, id)).returning()
	);
	return Promise.all(deletePromises);
};

// Additional bad practices: Duplicate count functions
export const countActiveUsers = async () => {
	const result = await db
		.select({ count: UsersTable.id })
		.from(UsersTable)
		.where(eq(UsersTable.status, 'active'));
	return Number(result[0].count);
};

export const countInactiveUsers = async () => {
	const result = await db
		.select({ count: UsersTable.id })
		.from(UsersTable)
		.where(eq(UsersTable.status, 'inactive'));
	return Number(result[0].count);
};

export const countAdminUsers = async () => {
	const result = await db
		.select({ count: UsersTable.id })
		.from(UsersTable)
		.where(eq(UsersTable.role, 'admin'));
	return Number(result[0].count);
};

export const countRegularUsers = async () => {
	const result = await db
		.select({ count: UsersTable.id })
		.from(UsersTable)
		.where(eq(UsersTable.role, 'user'));
	return Number(result[0].count);
};

