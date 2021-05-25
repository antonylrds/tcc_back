import { getRepository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import AppError from '../errors/AppError';

import User from '../models/User';

interface ChangePasswordDTO {
  id: string;
  oldPassword: string;
  newPassword: string;
}

class ChangePasswordService {
  public async execute({
    id,
    oldPassword,
    newPassword,
  }: ChangePasswordDTO): Promise<void> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const passwordMatch = await compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new AppError('Email ou senha inválida', 401);
    }

    const hashedPassword = await hash(newPassword, 8);

    user.password = hashedPassword;

    await usersRepository.save(user);
  }
}

export default ChangePasswordService;
