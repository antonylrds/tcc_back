import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

import Paper from '../models/Paper';

class DeletePaperService {
  public async execute(id: string): Promise<void> {
    const papersRepository = getRepository(Paper);

    const paper = await papersRepository.findOne(id);

    if (!paper) {
      throw new AppError('Paper not found');
    }

    if (paper.path) {
      const paperPath = path.join(uploadConfig.directory, paper.path);
      const fileExists = fs.existsSync(paperPath);

      if (fileExists) {
        await fs.promises.unlink(paperPath);
      }
    }

    await papersRepository.remove(paper);
  }
}

export default DeletePaperService;
