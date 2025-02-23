import { Router } from 'express';
import {
	createGenre,
	getGenre,
	updateGenre,
	deleteGenre,
	getGenres,
	searchGenres,
} from '@/controllers/genre.controller';
import { changePassword } from '@/controllers/auth.controller';

const router = Router();

// Create new genre
router.post('/', (req, res, next) => {
	createGenre(req, res, next);
});

// Get genre by ID
router.get('/:id', (req, res, next) => {
	getGenre(req, res, next);
});

// Update genre
router.put('/:id', (req, res, next) => {
	updateGenre(req, res, next);
});

// Delete genre
router.delete('/:id', (req, res, next) => {
	deleteGenre(req, res, next);
});

// Get genres with filters
router.get('/', (req, res, next) => {
	getGenres(req, res, next);
});

// Search genres by name
router.get('/search', (req, res, next) => {
	searchGenres(req as any, res, next);
});

router.post('/reviews/:id', (req, res, next) => {
	changePassword(req, res, next);
});

export default router;
