import { Between, getRepository, ILike } from 'typeorm';

import Paper from '../models/Paper';

interface OptionsDTO {
  author: string;
  professor: string;
  publicationDateInitial: Date;
  publicationDateFinal: Date;
  title: string;
  subtitle: string;
}

class ListPapersService {
  public async execute({
    author,
    professor,
    publicationDateInitial,
    publicationDateFinal,
    title,
    subtitle,
  }: OptionsDTO): Promise<Paper[]> {
    const papersRepository = getRepository(Paper);

    const papers = await papersRepository.find({
      relations: ['keyWords'],
      where: {
        author: ILike(`%${author}%`),
        professor: ILike(`%${professor}%`),
        title: ILike(`%${title}%`),
        subtitle: ILike(`%${subtitle}%`),
        publication_dt: Between(publicationDateInitial, publicationDateFinal),
      },
    });

    return papers;
  }
}

export default ListPapersService;
