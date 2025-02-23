import { Router } from 'express';
import {
	createPublisher,
	getPublisher,
	updatePublisher,
	deletePublisher,
	getPublishers,
	searchPublishers,
} from '@/controllers/publisher.controller';

const router = Router();

// Create new publisher
router.post('/', (req, res, next) => {
	createPublisher(req, res, next);
});

// Get publisher by ID
router.get('/:id', (req, res, next) => {
	getPublisher(req, res, next);
});

// Update publisher
router.put('/:id', (req, res, next) => {
	updatePublisher(req, res, next);
});

// Delete publisher
router.delete('/:id', (req, res, next) => {
	deletePublisher(req, res, next);
});

// Get publishers with filters
router.get('/', (req, res, next) => {
	getPublishers(req, res, next);
});

// Search publishers by name
router.get('/search', (req, res, next) => {
	searchPublishers(req as any, res, next);
});

export default router;
