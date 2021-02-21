import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import ListPapersService from '../services/ListPapersService';
import CreatePaperService from '../services/CreatePaperService';
import UploadPaperService from '../services/UploadPaperService';

import ensureAuthenticated from '../middlewares/ensureAuthenticate';

const papersRouter = Router();
const upload = multer(uploadConfig);

papersRouter.use(ensureAuthenticated);

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

papersRouter.patch('/:id', upload.single('file'), async (request, response) => {
  const uploadPaperService = new UploadPaperService();

  const { id } = request.params;

  const paper = await uploadPaperService.execute({
    id,
    filename: request.file.filename,
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
