import { Router } from 'express';
import * as Yup from 'yup';

import CreateUserService from '../services/CreateUserService';
import ListUserPapersService from '../services/ListUserPapersService';

import ensureAuthenticated from '../middlewares/ensureAuthenticate';
import AppError from '../errors/AppError';
import DeleteUserService from '../services/DeleteUserService';
import ListUsersService from '../services/ListUsersService';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const listUsersService = new ListUsersService();

  const users = await listUsersService.execute();

  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().required('Senha é obrigatória'),
  });

  try {
    await schema.validate(request.body, { abortEarly: false });
  } catch (err) {
    throw new AppError(err.errors);
  }

  const { name, email, password } = request.body;
  const createUserService = new CreateUserService();

  const user = await createUserService.execute({
    name,
    email,
    password,
  });

  delete user.password;
  delete user.id;

  return response.json(user);
});

usersRouter.get('/papers', ensureAuthenticated, async (request, response) => {
  const listUserPapersService = new ListUserPapersService();

  const papers = await listUserPapersService.execute(request.user.id);

  return response.json(papers);
});

usersRouter.delete('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;
  const deleteUserService = new DeleteUserService();

  await deleteUserService.execute(id);

  return response.status(204).send('Usuário removido');
});

export default usersRouter;
