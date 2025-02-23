import { UpdateUser, UsersTable } from '@/db/schemas';
import { NewUser } from '@/db/schemas';
import {
	FindOptions,
	UserRepository,
	UserRepository2,
} from './user.repository';
import { sql } from 'drizzle-orm';

export class UserService {
	constructor(private readonly repository: UserRepository) {}

	async findAll(options?: FindOptions) {
		// add some logic here
		return this.repository.findAll(options);
	}

	async findById(id: string) {
		// add some logic here
		return this.repository.findById(id);
	}

	async search(options: FindOptions & { query: string }) {
		// add some logic here
		return this.repository.search(options);
	}

	async create(data: NewUser) {
		// add some logic here
		return this.repository.create(data);
	}

	async update(id: string, data: UpdateUser) {
		// add some logic here
		return this.repository.update(id, data);
	}

	async delete(id: string) {
		// add some logic here
		return this.repository.delete(id);
	}
}

class UserService2 {
	constructor(private readonly repository: UserRepository2) {}

	async findAll(options?: FindOptions) {
		// add some logic here
		return this.repository.findAll();
	}

	async findById(id: string) {
		return this.repository.findById(id);
	}

	async search(options: FindOptions & { query: string }) {
		return this.repository.findAll({
			where: sql`${UsersTable.name} ILIKE ${options.query}`,
		});
	}

	async create(data: NewUser) {
		const user = await this.repository.create(data);
		return user;
	}
}
