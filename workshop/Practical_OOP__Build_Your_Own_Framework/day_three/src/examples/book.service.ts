import { BookTable, NewBook, UpdateBook } from '@/db/schemas';
import {
	FindOptions,
	BookRepository,
	BookRepository2,
} from './book.repository';
import { BaseService } from '@/lib/core/BaseService';

export class BookService {
	constructor(private readonly repository: BookRepository) {}

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

	async create(data: NewBook) {
		// add some logic here
		return this.repository.create(data);
	}

	async update(id: string, data: UpdateBook) {
		// add some logic here
		return this.repository.update(id, data);
	}

	async delete(id: string) {
		// add some logic here
		return this.repository.delete(id);
	}
}

class BookService2 extends BaseService<typeof BookTable, BookRepository2> {
	priceCalculator(price: number) {}
}
