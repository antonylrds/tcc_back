import { getRepository, In } from 'typeorm';
import AppError from '../errors/AppError';
import KeyWord from '../models/KeyWord';
import Paper from '../models/Paper';
import User from '../models/User';

interface PaperDTO {
  title: string;
  subtitle: string;
  author: string;
  professor: string;
  user_id: string;
  publicationDate: Date;
  keywords: string[];
  filename: string;
  abstract: string;
}

class CreatePaperService {
  public async execute({
    author,
    professor,
    title,
    subtitle,
    user_id,
    publicationDate,
    keywords,
    filename,
    abstract,
  }: PaperDTO): Promise<Paper> {
    const papersRepository = getRepository(Paper);
    const usersRepository = getRepository(User);
    const keywordsRepository = getRepository(KeyWord);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const existingKeywords = await keywordsRepository.find({
      where: { word: In(keywords) },
    });

    const existingWords = existingKeywords.map(keyword => keyword.word);

    const nonExistingWords = keywords.filter(
      keyword => !existingWords.includes(keyword),
    );

    const newKeywords = nonExistingWords.map(keyword =>
      keywordsRepository.create({ word: keyword }),
    );

    await keywordsRepository.save(newKeywords);

    const paper = papersRepository.create({
      author,
      professor,
      title,
      subtitle,
      publication_dt: publicationDate,
      uploaded_by: user,
      keyWords: [...existingKeywords, ...newKeywords],
      path: filename,
      abstract,
    });

    await papersRepository.save(paper);

    return paper;
  }
}

export default CreatePaperService;
