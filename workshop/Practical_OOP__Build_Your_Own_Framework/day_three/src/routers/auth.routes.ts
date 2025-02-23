import { register, login, changePassword } from '@/controllers/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/register', (req, res, next) => {
	register(req, res, next);
});

router.post('/login', (req, res, next) => {
	login(req, res, next);
});

router.patch('/change-password/:id', (req, res, next) => {
	changePassword(req, res, next);
});

export default router;
