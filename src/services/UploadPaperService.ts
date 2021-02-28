import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

import Paper from '../models/Paper';

interface FileDTO {
  id: string;
  filename: string;
}

class UploadPaperService {
  public async execute({ id, filename }: FileDTO): Promise<Paper> {
    const papersRepository = getRepository(Paper);

    const paper = await papersRepository.findOne(id);

    if (!paper) {
      throw new AppError('Papers not found');
    }

    if (paper.path) {
      const paperPath = path.join(uploadConfig.directory, paper.path);
      const fileExists = fs.existsSync(paperPath);

      if (fileExists) {
        await fs.promises.unlink(paperPath);
      }
    }

    paper.path = filename;

    await papersRepository.save(paper);

    return paper;
  }
}

export default UploadPaperService;
