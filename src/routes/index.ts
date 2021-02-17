import { Router } from 'express';

import papersRouter from './papers.routes';
import usersRouter from './users.routes';
import sessionsRouter from './session.routes';

const routes = Router();

routes.use('/papers', papersRouter);
routes.use('/users', usersRouter);
routes.use('/session', sessionsRouter);

export default routes;
