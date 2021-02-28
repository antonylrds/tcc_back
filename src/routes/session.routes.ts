import { Router } from 'express';
import * as Yup from 'yup';
import AppError from '../errors/AppError';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const schema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().required('Senha é obrigatória'),
  });

  try {
    await schema.validate(request.body, { abortEarly: false });
  } catch (err) {
    throw new AppError(err.errors);
  }

  const authenticateUserService = new AuthenticateUserService();

  const { email, password } = request.body;

  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });

  return response.json({ user, token });
});

export default sessionsRouter;
