import { getRepository } from 'typeorm';
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
}

class CreatePaperService {
  public async execute({
    author,
    professor,
    title,
    subtitle,
    user_id,
    publicationDate,
  }: PaperDTO): Promise<Paper> {
    const papersRepository = getRepository(Paper);
    const usersRepository = getRepository(User);
    const keywordsRepository = getRepository(KeyWord);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('User not found');
    }

    // Create Nonexisting keywords and get ids from all

    const paper = papersRepository.create({
      author,
      professor,
      title,
      subtitle,
      publication_date: publicationDate,
      uploaded_by: user,
    });

    await papersRepository.save(paper);

    return paper;
  }
}

export default CreatePaperService;
