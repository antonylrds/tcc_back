import { getRepository } from 'typeorm';

import Paper from '../models/Paper';

class ListPapersService {
  public async execute(): Promise<Paper[]> {
    const papersRepository = getRepository(Paper);

    const papers = await papersRepository.find({ relations: ['keyWords'] });

    return papers;
  }
}

export default ListPapersService;
