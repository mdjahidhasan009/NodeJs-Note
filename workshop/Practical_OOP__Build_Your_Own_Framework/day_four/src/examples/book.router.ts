import { Router } from 'express';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';

const router = Router();

router.get('/', (req, res) => {
	const controller = new BookController(new BookService(new BookRepository()));
	controller.findAll(req, res);
});
router.get('/:id', (req, res) => {
	const controller = new BookController(new BookService(new BookRepository()));
	controller.findById(req, res);
});
router.get('/search', (req, res) => {
	const controller = new BookController(new BookService(new BookRepository()));
	controller.search(req, res);
});
router.post('/', (req, res) => {
	const controller = new BookController(new BookService(new BookRepository()));
	controller.create(req, res);
});
router.put('/:id', (req, res) => {
	const controller = new BookController(new BookService(new BookRepository()));
	controller.update(req, res);
});
router.delete('/:id', (req, res) => {
	const controller = new BookController(new BookService(new BookRepository()));
	controller.delete(req, res);
});

export default router;
