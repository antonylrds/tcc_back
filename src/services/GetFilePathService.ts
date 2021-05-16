import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Paper from '../models/Paper';

class GetFilePathService {
  public async execute(id: string): Promise<string> {
    const papersRepository = getRepository(Paper);

    const paper = await papersRepository.findOne(id);

    if (!paper || !paper.path) {
      throw new AppError('Nenhum arquivo encontrado');
    }

    return paper.path;
  }
}

export default GetFilePathService;
