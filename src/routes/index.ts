import { Router } from 'express';

import papersRouter from './papers.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/papers', papersRouter);
routes.use('/users', usersRouter);

export default routes;
