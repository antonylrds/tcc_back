import { Router } from 'express';

import ListPapersService from '../services/ListPapersService';
import CreatePaperService from '../services/CreatePaperService';

const papersRouter = Router();

papersRouter.get('/', async (resquest, response) => {
  const listPapersService = new ListPapersService();

  const papers = await listPapersService.execute();

  return response.json(papers);
});

papersRouter.post('/', async (request, response) => {
  const {
    author,
    professor,
    title,
    subtitle,
    publicationDate,
    keywords,
  } = request.body;

  const createPaperService = new CreatePaperService();
  const paper = await createPaperService.execute({
    author,
    professor,
    title,
    subtitle,
    publicationDate,
    user_id: request.user.id,
    keywords,
  });

  return response.json(paper);
});

papersRouter.put('/', (request, response) => {
  return response.json({ msg: true });
});

papersRouter.delete('/', (request, response) => {
  return response.json({ msg: true });
});

export default papersRouter;
