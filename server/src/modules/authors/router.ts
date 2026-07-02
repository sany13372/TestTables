import { Router } from 'express';
import authorRoutes from './routes/author.routes';

const authorsRouter = Router();

authorsRouter.use('/authors', authorRoutes);

export default authorsRouter;