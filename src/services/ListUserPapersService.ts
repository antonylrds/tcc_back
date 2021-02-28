import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Paper from '../models/Paper';

class ListUserPapersService {
  public async execute(userId: string): Promise<Paper[]> {
    const papersRepository = getRepository(Paper);

    const papers = await papersRepository.find({
      where: { uploaded_by: userId },
    });

    if (!papers) {
      throw new AppError('No Paper found');
    }

    return papers;
  }
}

export default ListUserPapersService;
