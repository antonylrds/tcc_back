import { getRepository } from 'typeorm';

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

    paper.path = filename;

    await papersRepository.save(paper);

    return paper;
  }
}

export default UploadPaperService;
