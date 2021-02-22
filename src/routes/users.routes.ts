import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';
import ListUserPapersService from '../services/ListUserPapersService';

import ensureAuthenticated from '../middlewares/ensureAuthenticate';

const usersRouter = Router();

usersRouter.get('/', (request, response) => {
  return response.json({ msg: true });
});

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUserService = new CreateUserService();

  const user = await createUserService.execute({
    name,
    email,
    password,
  });

  return response.json(user);
});

usersRouter.get('/papers', ensureAuthenticated, async (request, response) => {
  const listUserPapersService = new ListUserPapersService();

  const papers = await listUserPapersService.execute(request.user.id);

  return response.json(papers);
});

export default usersRouter;
