import { Router } from 'express';
import bookRoutes from './routes/book.routes';

const booksRouter = Router();

booksRouter.use('/books', bookRoutes);

export default booksRouter;
