import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import User from '../models/User';

class ListUsersService {
  public async execute(): Promise<User[]> {
    const usersRepository = getRepository(User);

    const users = await usersRepository.find();

    if (users.length < 1) {
      throw new AppError('Nenhum usuário encontrado', 404);
    }

    return users;
  }
}

export default ListUsersService;
