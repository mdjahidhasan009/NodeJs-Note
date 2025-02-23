import { Router } from 'express';
import {
	createBook,
	getBook,
	updateBook,
	deleteBook,
	getBooks,
	searchBooks,
	updateBookStatus,
} from '@/controllers/book.controller';

const router = Router();

// Create new book
router.post('/', (req, res, next) => {
	createBook(req, res, next);
});

// Get book by ID
router.get('/:id', (req, res, next) => {
	getBook(req, res, next);
});

// Update book
router.patch('/:id', (req, res, next) => {
	updateBook(req, res, next);
});

// Delete book
router.delete('/:id', (req, res, next) => {
	deleteBook(req, res, next);
});

// Get books with filters
router.get('/', (req, res, next) => {
	getBooks(req, res, next);
});

// Search books by title
router.get('/search', (req, res, next) => {
	searchBooks(req, res, next);
});

// Update book status
router.patch('/:id/status', (req, res, next) => {
	updateBookStatus(req, res, next);
});

export default router;
