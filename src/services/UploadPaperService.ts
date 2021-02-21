import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';

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
      throw new Error('Papers not found');
    }

    if (paper.path) {
      const paperPath = path.join(uploadConfig.directory, paper.path);
      const paperExists = await fs.promises.stat(paperPath);

      if (paperExists) {
        await fs.promises.unlink(paperPath);
      }
    }

    paper.path = filename;

    await papersRepository.save(paper);

    return paper;
  }
}

export default UploadPaperService;
