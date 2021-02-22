import { getRepository } from 'typeorm';

import Paper from '../models/Paper';

class ListUserPapersService {
  public async execute(userId: string): Promise<Paper[]> {
    const papersRepository = getRepository(Paper);

    const papers = await papersRepository.find({
      where: { uploaded_by: userId },
    });

    if (!papers) {
      throw new Error('No Paper found');
    }

    return papers;
  }
}

export default ListUserPapersService;
