import { getRepository, In } from 'typeorm';
import Paper from '../models/Paper';
import KeyWord from '../models/KeyWord';

interface PaperDTO {
  id: string;
  author?: string;
  professor?: string;
  publicationDate?: Date;
  title?: string;
  subtitle?: string;
  keywords?: string[];
}

class UpdatePaperService {
  public async excute({
    id,
    author,
    professor,
    title,
    subtitle,
    publicationDate,
    keywords,
  }: PaperDTO): Promise<Paper> {
    const papersRepository = getRepository(Paper);
    const keywordsRepository = getRepository(KeyWord);

    const paper = await papersRepository.findOne(id);

    if (!paper) {
      throw new Error('Paper not found');
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

    const updatedPaper = {
      ...paper,
      author,
      professor,
      title,
      subtitle,
      publicationDate,
      keyWords: [...existingKeywords, ...newKeywords],
    };

    await papersRepository.save(updatedPaper);

    return updatedPaper;
  }
}

export default UpdatePaperService;
