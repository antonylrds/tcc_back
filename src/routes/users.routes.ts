import { Router } from 'express';
import User from '../models/User';

import CreateUserService from '../services/CreateUserService';

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

  delete user.id;

  return response.json(user);
});

export default usersRouter;
