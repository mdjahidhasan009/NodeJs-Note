import { Request, Response, NextFunction } from 'express';
import * as bookService from '@/services/book.service';
import { NewBook, UpdateBook } from '@/db/schemas/book';
import { BookFilters } from '@/services/book.service';

export const createBook = async (
	req: Request<{}, {}, NewBook>,
	res: Response,
	next: NextFunction
) => {
	try {
		const bookData: NewBook = req.body;

		if (!bookData.title || !bookData.author) {
			return next(new Error('Missing required fields'));
		}

		const book = await bookService.createBook(bookData);
		return res.status(201).json(book[0]);
	} catch (error) {
		console.error('Error creating book:', error);
		return next(new Error('Internal server error'));
	}
};

export const getBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		if (!id) {
			return next(new Error('Book ID is required'));
		}

		const book = await bookService.findBookById(id);
		if (!book) {
			return next(new Error('Book not found'));
		}

		return res.status(200).json(book);
	} catch (error) {
		console.error('Error fetching book:', error);
		return next(new Error('Internal server error'));
	}
};

export const updateBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const updates: UpdateBook = req.body;

		if (!id) {
			return next(new Error('Book ID is required'));
		}

		const book = await bookService.findBookById(id);
		if (!book) {
			return next(new Error('Book not found'));
		}

		const updatedBook = await bookService.updateBook(id, updates);
		return res.status(200).json(updatedBook[0]);
	} catch (error) {
		console.error('Error updating book:', error);
		return next(new Error('Internal server error'));
	}
};

export const deleteBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		if (!id) {
			return next(new Error('Book ID is required'));
		}

		const book = await bookService.findBookById(id);
		if (!book) {
			return next(new Error('Book not found'));
		}

		const deletedBook = await bookService.deleteBook(id);
		return res.status(200).json(deletedBook[0]);
	} catch (error) {
		console.error('Error deleting book:', error);
		return next(new Error('Internal server error'));
	}
};

export const getBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			title,
			authorId,
			publisherId,
			genreId,
			status,
			sortBy,
			sortOrder,
			page = '1',
			limit = '10',
		} = req.query;

		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);

		const filters = {
			...(title && { title: title as string }),
			...(authorId && { authorId: authorId as string }),
			...(publisherId && { publisherId: publisherId as string }),
			...(genreId && { genreId: genreId as string }),
			...(status && { status: status as string }),
			...(sortBy && { sortBy: sortBy as string }),
			...(sortOrder && { sortOrder: sortOrder as 'asc' | 'desc' }),
		} as BookFilters;

		const books = await bookService.getBooks(filters, pageNum, limitNum);
		return res.status(200).json(books);
	} catch (error) {
		console.error('Error fetching books:', error);
		return next(new Error('Internal server error'));
	}
};

export const searchBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { query, page = '1', limit = '10' } = req.query;

		if (!query) {
			return next(new Error('Search query is required'));
		}

		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);

		const books = await bookService.searchBooksByTitle(
			query as string,
			pageNum,
			limitNum
		);

		return res.status(200).json(books);
	} catch (error) {
		console.error('Error searching books:', error);
		return next(new Error('Internal server error'));
	}
};

export const updateBookStatus = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!id) {
			return next(new Error('Book ID is required'));
		}

		if (!status) {
			return next(new Error('Status is required'));
		}

		const book = await bookService.findBookById(id);
		if (!book) {
			return next(new Error('Book not found'));
		}

		const updatedBook = await bookService.updateBookStatus(id, status);
		return res.status(200).json(updatedBook[0]);
	} catch (error) {
		console.error('Error updating book status:', error);
		return next(new Error('Internal server error'));
	}
};
