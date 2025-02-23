import { UserService } from '@/services/user.service';
import { Request, Response } from 'express';
import {FindOptionsSchema} from "@/lib/core/IBaseRepository";
import {FilterRuleGroup} from "@/lib/core/FilterBuilder";
import {UpdateUserSchema} from "@/db/schemas";
import {Controller, Delete, Get, Post, Put, Use} from "@/lib/decorator";
import { singleton } from 'tsyringe';

@singleton()
@Controller('/api/v3/users')
export class UserController {
	constructor(private readonly service: UserService) {}

	@Get('/')
	@Use((req, res, next) => {
		console.log('Middleware 1');
		next();
	})
	async findAll(req: Request, res: Response) {
		const parsedQuery = FindOptionsSchema.safeParse(req.query);
		if(!parsedQuery.success) {
			return res.status(400).json({ message: 'Invalid query parameters' });
		}
		const users = await this.service.findAll(parsedQuery.data);
		res.json(users);
	}

	@Get('/:id')
	async findById(req: Request, res: Response) {
		const user = await this.service.findById(req.params?.id);
		res.json(user);
	}

	@Get('/search')
	async search(req: Request, res: Response) {
		const { query } = req.query;
		const where: FilterRuleGroup = {
			combinator: 'or',
			rules: [
				{ field: 'name', operator: 'contains', value: query },
				{ field: 'email', operator: 'contains', value: query },
				{ field: 'id', operator: '=', value: query },
			],
		}
		const users = await this.service.findAll({ where: where });
		res.json(users);
	}

	@Post('/')
	async create(req: Request, res: Response) {
		try {
			const user = await this.service.create(req.body);
			res.json(user);
		} catch (error) {
			console.log('Error in create:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	@Put('/:id')
	async update(req: Request, res: Response) {
		const parsedBody = UpdateUserSchema.safeParse(req.body);
		if(!parsedBody.success) {
			return res.status(400).json({ message: 'Invalid request body' });
		}
		const user = await this.service.update(req.params?.id, parsedBody.data);
		res.json(user);
	}

	@Delete('/:id')
	async delete(req: Request, res: Response) {
		await this.service.delete(req.params?.id);
		res.status(204).send();
	}
}