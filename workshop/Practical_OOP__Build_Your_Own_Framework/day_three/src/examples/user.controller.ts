import { UserService } from './user.service';
import { Request, Response } from 'express';

export class UserController {
	constructor(private readonly service: UserService) {}

	async findAll(req: Request, res: Response) {
		try {
			const { page, limit, orderBy, orderDirection } = req.query;

			const users = await this.service.findAll({
				page: page ? Number(page) : undefined,
				limit: limit ? Number(limit) : undefined,
				orderBy: orderBy ? String(orderBy) : undefined,
				orderDirection: orderDirection
					? (orderDirection as 'asc' | 'desc')
					: undefined,
			});
			res.json(users);
		} catch (error) {
			console.log('Error in findAll:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async findById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const user = await this.service.findById(id);
			res.json(user);
		} catch (error) {
			console.log('Error in findById:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async search(req: Request, res: Response) {
		try {
			const { query } = req.query;
			const users = await this.service.search({ query: String(query) });
			res.json(users);
		} catch (error) {
			console.log('Error in search:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async create(req: Request, res: Response) {
		try {
			const user = await this.service.create(req.body);
			res.json(user);
		} catch (error) {
			console.log('Error in create:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const user = await this.service.update(id, req.body);
			res.json(user);
		} catch (error) {
			console.log('Error in update:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await this.service.delete(id);
			res.status(204).send();
		} catch (error) {
			console.log('Error in delete:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}
