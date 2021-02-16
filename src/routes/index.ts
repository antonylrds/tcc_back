import { Router } from 'express';

import papersRouter from './papers.routes';

const routes = Router();

routes.use('/papers', papersRouter);

export default routes;
