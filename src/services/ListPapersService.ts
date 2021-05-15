import { getRepository } from 'typeorm';

import Paper from '../models/Paper';

interface OptionsDTO {
  author: string;
  professor: string;
  publicationYear: string;
  title: string;
  page: number;
  limit: number;
  keywords: string[];
}

class ListPapersService {
  public async execute({
    author,
    professor,
    publicationYear,
    title,
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

    // Limita a busca aos IDS filtrados no IF anterior
    if (papersIds) {
      papersQuery.andWhere('paper.id IN (:...papersIds)', { papersIds });
    }

    // Busca por subpalavra no campo autor
    if (author) {
      papersQuery.andWhere(`paper.author ilike :author`, {
        author: `%${author}%`,
      });
    }

    // Busca por subpalavra no campo professor orientador
    if (professor) {
      papersQuery.andWhere(`paper.professor ilike :professor`, {
        professor: `%${professor}%`,
      });
    }

    // Busca por subpalavra no título ou subtítulo
    if (title) {
      papersQuery.andWhere(`paper.title ilike :title`, { title: `%${title}%` });

      papersQuery.orWhere(`paper.subtitle ilike :subtitle`, {
        subtitle: `%${title}%`,
      });
    }

    // Busca por publicações de um ano em específico
    if (publicationYear) {
      papersQuery
        .andWhere(`paper.publication_dt >= :publicationDateInitial`, {
          publicationDateInitial: `01-01-${publicationYear} 00:00:00`,
        })
        .andWhere(`paper.publication_dt <= :publicationDateFinal`, {
          publicationDateFinal: `12-31-${publicationYear} 23:59:59`,
        });
    }

    papersQuery
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('paper.title');
    const papers = await papersQuery.getMany();

    return papers;
  }
}

export default ListPapersService;
