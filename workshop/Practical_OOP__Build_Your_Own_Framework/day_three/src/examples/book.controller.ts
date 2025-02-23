import { BookService } from './book.service';
import { Request, Response } from 'express';

export class BookController {
	constructor(private readonly service: BookService) {}

	async findAll(req: Request, res: Response) {
		try {
			const { page, limit, orderBy, orderDirection, query } = req.query;

			const books = await this.service.findAll({
				page: page ? Number(page) : undefined,
				limit: limit ? Number(limit) : undefined,
				orderBy: orderBy ? String(orderBy) : undefined,
				orderDirection: orderDirection
					? (orderDirection as 'asc' | 'desc')
					: undefined,
			});
			res.json(books);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async findById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const book = await this.service.findById(id);
			res.json(book);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async search(req: Request, res: Response) {
		try {
			const { query } = req.query;
			const books = await this.service.search({ query: String(query) });
			res.json(books);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async create(req: Request, res: Response) {
		try {
			const book = await this.service.create(req.body);
			res.json(book);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const book = await this.service.update(id, req.body);
			res.json(book);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await this.service.delete(id);
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}
