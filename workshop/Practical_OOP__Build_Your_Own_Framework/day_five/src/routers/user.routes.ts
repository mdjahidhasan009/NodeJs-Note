import { Router } from 'express';
import {
	createUser,
	getUser,
	updateUser,
	deleteUser,
	searchUsers,
} from '@/controllers/user.controller';

const router = Router();

// Create new user
router.post('/', (req, res, next) => {
	createUser(req, res, next);
});

// Get user by ID
router.get('/:id', (req, res, next) => {
	getUser(req, res, next);
});

// Update user
router.patch('/:id', (req, res, next) => {
	updateUser(req, res, next);
});

// Delete user (supports ?permanent=true query param)
router.delete('/:id', (req, res, next) => {
	deleteUser(req, res, next);
});

// Search users (supports ?type=email|name&page=1&limit=10)
router.get('/', (req, res, next) => {
	searchUsers(req, res, next);
});

export default router;
