import { Request, Response, NextFunction } from 'express';
import * as publisherService from '@/services/publisher.service';
import { NewPublisher, UpdatePublisher } from '@/db/schemas';

export const createPublisher = async (
	req: Request<{}, {}, NewPublisher>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name } = req.body;

		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			return res
				.status(400)
				.json({ message: 'Valid publisher name is required' });
		}

		const publisher = await publisherService.createPublisher(req.body);
		return res.status(201).json(publisher[0]);
	} catch (error) {
		return next(error);
	}
};

export const getPublisher = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		if (!id || typeof id !== 'string') {
			return res
				.status(400)
				.json({ message: 'Valid publisher ID is required' });
		}

		const publisher = await publisherService.findPublisherById(id);
		if (!publisher) {
			return res.status(404).json({ message: 'Publisher not found' });
		}
		return res.json(publisher);
	} catch (error) {
		return next(error);
	}
};

export const updatePublisher = async (
	req: Request<{ id: string }, {}, UpdatePublisher>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		if (!id || typeof id !== 'string') {
			return res
				.status(400)
				.json({ message: 'Valid publisher ID is required' });
		}

		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			return res
				.status(400)
				.json({ message: 'Valid publisher name is required' });
		}

		const publisher = await publisherService.updatePublisher(id, req.body);
		if (!publisher.length) {
			return res.status(404).json({ message: 'Publisher not found' });
		}
		return res.json(publisher[0]);
	} catch (error) {
		return next(error);
	}
};

export const deletePublisher = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		if (!id || typeof id !== 'string') {
			return res
				.status(400)
				.json({ message: 'Valid publisher ID is required' });
		}

		const publisher = await publisherService.deletePublisher(id);
		if (!publisher.length) {
			return res.status(404).json({ message: 'Publisher not found' });
		}
		return res.json(publisher[0]);
	} catch (error) {
		return next(error);
	}
};

interface GetPublishersQuery {
	name?: string;
	page?: string;
	limit?: string;
}

export const getPublishers = async (
	req: Request<{}, {}, {}, GetPublishersQuery>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, page, limit } = req.query;

		if (page && (isNaN(Number(page)) || Number(page) < 1)) {
			return res
				.status(400)
				.json({ message: 'Page must be a positive number' });
		}

		if (limit && (isNaN(Number(limit)) || Number(limit) < 1)) {
			return res
				.status(400)
				.json({ message: 'Limit must be a positive number' });
		}

		const result = await publisherService.getPublishers(
			name,
			page ? parseInt(page) : undefined,
			limit ? parseInt(limit) : undefined
		);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

export const searchPublishers = async (
	req: Request<{}, {}, {}, { q: string; page?: string; limit?: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { q, page, limit } = req.query;

		if (!q || typeof q !== 'string' || q.trim().length === 0) {
			return res.status(400).json({ message: 'Search query is required' });
		}

		if (page && (isNaN(Number(page)) || Number(page) < 1)) {
			return res
				.status(400)
				.json({ message: 'Page must be a positive number' });
		}

		if (limit && (isNaN(Number(limit)) || Number(limit) < 1)) {
			return res
				.status(400)
				.json({ message: 'Limit must be a positive number' });
		}

		const result = await publisherService.searchPublishersByName(
			q,
			page ? parseInt(page) : undefined,
			limit ? parseInt(limit) : undefined
		);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};
