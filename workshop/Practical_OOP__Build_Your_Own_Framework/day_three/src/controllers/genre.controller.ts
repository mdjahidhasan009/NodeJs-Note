import { Request, Response, NextFunction } from 'express';
import * as genreService from '@/services/genre.service';
import { NewBookGenre, UpdateBookGenre } from '@/db/schemas';

export const createGenre = async (
	req: Request<{}, {}, NewBookGenre>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name } = req.body;

		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			return res.status(400).json({ message: 'Valid genre name is required' });
		}

		const genre = await genreService.createGenre(req.body);
		return res.status(201).json(genre[0]);
	} catch (error) {
		return next(error);
	}
};

export const getGenre = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		if (!id || typeof id !== 'string') {
			return res.status(400).json({ message: 'Valid genre ID is required' });
		}

		const genre = await genreService.findGenreById(id);
		if (!genre) {
			return res.status(404).json({ message: 'Genre not found' });
		}
		return res.json(genre);
	} catch (error) {
		return next(error);
	}
};

export const updateGenre = async (
	req: Request<{ id: string }, {}, UpdateBookGenre>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		if (!id || typeof id !== 'string') {
			return res.status(400).json({ message: 'Valid genre ID is required' });
		}

		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			return res.status(400).json({ message: 'Valid genre name is required' });
		}

		const genre = await genreService.updateGenre(id, req.body);
		if (!genre.length) {
			return res.status(404).json({ message: 'Genre not found' });
		}
		return res.json(genre[0]);
	} catch (error) {
		return next(error);
	}
};

export const deleteGenre = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		if (!id || typeof id !== 'string') {
			return res.status(400).json({ message: 'Valid genre ID is required' });
		}

		const genre = await genreService.deleteGenre(id);
		if (!genre.length) {
			return res.status(404).json({ message: 'Genre not found' });
		}
		return res.json(genre[0]);
	} catch (error) {
		return next(error);
	}
};

interface GetGenresQuery {
	name?: string;
	page?: string;
	limit?: string;
}

export const getGenres = async (
	req: Request<{}, {}, {}, GetGenresQuery>,
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

		const result = await genreService.getGenres(
			name,
			page ? parseInt(page) : undefined,
			limit ? parseInt(limit) : undefined
		);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};

export const searchGenres = async (
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

		const result = await genreService.searchGenresByName(
			q,
			page ? parseInt(page) : undefined,
			limit ? parseInt(limit) : undefined
		);
		return res.json(result);
	} catch (error) {
		return next(error);
	}
};
