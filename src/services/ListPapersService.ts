import { Between, getRepository, ILike } from 'typeorm';

import Paper from '../models/Paper';

interface OptionsDTO {
  author: string;
  professor: string;
  publicationDateInitial: Date;
  publicationDateFinal: Date;
  title: string;
  subtitle: string;
  page: number;
  limit: number;
}

class ListPapersService {
  public async execute({
    author,
    professor,
    publicationDateInitial,
    publicationDateFinal,
    title,
    subtitle,
    limit,
    page,
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
      take: limit,
      skip: (page - 1) * limit,
    });

    return papers;
  }
}

export default ListPapersService;
