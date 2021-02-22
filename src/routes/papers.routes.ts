import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import ListPapersService from '../services/ListPapersService';
import CreatePaperService from '../services/CreatePaperService';
import UploadPaperService from '../services/UploadPaperService';
import DeletePaperService from '../services/DeletePaperService';
import UpdatePaperService from '../services/UpdatePaperService';

import ensureAuthenticated from '../middlewares/ensureAuthenticate';

const papersRouter = Router();
const upload = multer(uploadConfig);

papersRouter.use(ensureAuthenticated);

papersRouter.get('/', async (resquest, response) => {
  const listPapersService = new ListPapersService();

  const papers = await listPapersService.execute();

  return response.json(papers);
});

papersRouter.post('/', upload.single('file'), async (request, response) => {
  const {
    author,
    professor,
    title,
    subtitle,
    publicationDate,
    keywords,
  } = request.body;

  const parsedKeywords = JSON.parse(keywords);

  const createPaperService = new CreatePaperService();
  const paper = await createPaperService.execute({
    author,
    professor,
    title,
    subtitle,
    publicationDate,
    user_id: request.user.id,
    keywords: parsedKeywords,
    filename: request.file.filename,
  });

  delete paper.id;
  delete paper.uploaded_by.id;
  delete paper.uploaded_by.password;

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

papersRouter.put('/:id', async (request, response) => {
  const updatePaperService = new UpdatePaperService();
  const {
    author,
    professor,
    title,
    subtitle,
    publicationDate,
    keywords,
  } = request.body;

  const paper = await updatePaperService.excute({
    id: request.params.id,
    author,
    professor,
    title,
    subtitle,
    publicationDate,
    keywords,
  });

  return response.json(paper);
});

papersRouter.delete('/:id', async (request, response) => {
  const deletePaperService = new DeletePaperService();

  await deletePaperService.execute(request.params.id);

  return response.status(204).send();
});

export default papersRouter;
