import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

const router = Router();

router.get('/', (req, res) => {
	const controller = new UserController(new UserService(new UserRepository()));
	controller.findAll(req, res);
});
router.get('/:id', (req, res) => {
	const controller = new UserController(new UserService(new UserRepository()));
	controller.findById(req, res);
});
router.get('/search', (req, res) => {
	const controller = new UserController(new UserService(new UserRepository()));
	controller.search(req, res);
});
router.post('/', (req, res) => {
	const controller = new UserController(new UserService(new UserRepository()));
	controller.create(req, res);
});
router.put('/:id', (req, res) => {
	const controller = new UserController(new UserService(new UserRepository()));
	controller.update(req, res);
});
router.delete('/:id', (req, res) => {
	const controller = new UserController(new UserService(new UserRepository()));
	controller.delete(req, res);
});

export default router;
