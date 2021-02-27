import { getRepository } from 'typeorm';

import Paper from '../models/Paper';

interface OptionsDTO {
  author: string;
  professor: string;
  publicationDateInitial: string;
  publicationDateFinal: string;
  title: string;
  subtitle: string;
  page: number;
  limit: number;
  keywords: string[];
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
    keywords,
  }: OptionsDTO): Promise<Paper[]> {
    const papersRepository = getRepository(Paper);
    let papersIds: string[];

    const papersQuery = papersRepository
      .createQueryBuilder('paper')
      .leftJoinAndSelect('paper.keyWords', 'keyword')
      .where('paper.id is not null');

    if (keywords.length > 0) {
      papersIds = (
        await papersRepository
          .createQueryBuilder('paper')
          .select('paper.id')
          .distinctOn(['paper.id'])
          .leftJoinAndSelect('paper.keyWords', 'keyword')
          .where('keyword.word IN (:...keywords)', { keywords })
          .getMany()
      ).map(paperRaw => paperRaw.id);
    }

    if (papersIds) {
      papersQuery.andWhere('paper.id IN (:...papersIds)', { papersIds });
    }

    if (author) {
      papersQuery.andWhere(`paper.author ilike :author`, {
        author: `%${author}%`,
      });
    }

    if (professor) {
      papersQuery.andWhere(`paper.professor ilike :professor`, {
        professor: `%${professor}%`,
      });
    }

    if (title) {
      papersQuery.andWhere(`paper.title ilike :title`, { title: `%${title}%` });
    }

    if (subtitle) {
      papersQuery.andWhere(`paper.subtitle ilike :subtitle`, {
        subtitle: `%${subtitle}%`,
      });
    }

    if (publicationDateInitial && publicationDateFinal) {
      papersQuery
        .andWhere(`paper.publication_dt >= :publicationDateInitial`, {
          publicationDateInitial,
        })
        .andWhere(`paper.publication_dt <= :publicationDateFinal`, {
          publicationDateFinal,
        });
    }

    papersQuery.take(limit).skip((page - 1) * limit);
    const papers = await papersQuery.getMany();

    return papers;
  }
}

export default ListPapersService;
