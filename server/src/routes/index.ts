import { Router } from 'express';
import authorsRouter from '../modules/authors/router';
import booksRouter from '../modules/books/router';

const router = Router();

router.use(authorsRouter);
router.use(booksRouter);

export default router;
