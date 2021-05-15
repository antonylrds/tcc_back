import { Router } from 'express';
import multer from 'multer';
import * as Yup from 'yup';
import path from 'path';
import uploadConfig from '../config/upload';

import ListPapersService from '../services/ListPapersService';
import CreatePaperService from '../services/CreatePaperService';
import UploadPaperService from '../services/UploadPaperService';
import DeletePaperService from '../services/DeletePaperService';
import UpdatePaperService from '../services/UpdatePaperService';

import ensureAuthenticated from '../middlewares/ensureAuthenticate';
import AppError from '../errors/AppError';

const papersRouter = Router();
const upload = multer(uploadConfig);

papersRouter.get('/', async (request, response) => {
  const schema = Yup.object().shape({
    author: Yup.string(),
    from: Yup.date(),
    to: Yup.date(),
  });

  try {
    await schema.validate(request.query, { abortEarly: false });
  } catch (err) {
    throw new AppError(err.errors);
  }

  const listPapersService = new ListPapersService();

  const {
    author,
    professor,
    publicationYear,
    title,
    page,
    limit,
    keywords,
  } = request.query;

  const objDTO = {
    author: (author as string) || '',
    professor: (professor as string) || '',
    title: (title as string) || '',
    publicationYear: (publicationYear as string) || '',
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 10,
    keywords: keywords ? JSON.parse(String(keywords)) : [],
  };

  const papers = await listPapersService.execute(objDTO);

  return response.json(papers);
});

papersRouter.get('/download', (req, res) => {
  const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
  return res.download(
    path.join(tmpFolder, '00f5ffccdbbf65c912bd-TCC 2021.1 Antony Luan.docx'),
  );
});

papersRouter.use(ensureAuthenticated);

papersRouter.post('/', upload.single('file'), async (request, response) => {
  const schema = Yup.object().shape({
    author: Yup.string().required('Autor(a) é obrigatório'),
    professor: Yup.string().required('Orientador é obrigatório'),
    title: Yup.string().required('Título é obrigatório'),
    subtitle: Yup.string().required('Subtítulo é obrigatório'),
    publicationDate: Yup.date().required('Data de publicação é obrigatório'),
    keywords: Yup.array().required('Informe pelo menos uma palavra-chave'),
    abstract: Yup.string()
      .max(10000, 'O resumo não pode conter mais que 10.000 caracteres')
      .required('O resumo não pode ser vazio'),
  });

  try {
    await schema.validate(request.body, { abortEarly: false });
  } catch (err) {
    throw new AppError(err.errors);
  }

  const {
    author,
    professor,
    title,
    subtitle,
    publicationDate,
    keywords,
    abstract,
  } = request.body;

  const parsedKeywords: string[] = JSON.parse(keywords);

  if (parsedKeywords.length < 1) {
    throw new AppError('Informe pelo menos uma palavra-chave');
  }

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
    abstract,
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
  const schema = Yup.object().shape({
    author: Yup.string(),
    professor: Yup.string(),
    title: Yup.string(),
    subtitle: Yup.string(),
    publicationDate: Yup.date(),
    keywords: Yup.array(),
  });

  try {
    await schema.validate(request.body, { abortEarly: false });
  } catch (err) {
    throw new AppError(err.errors);
  }

  const updatePaperService = new UpdatePaperService();
  const {
    author,
    professor,
    title,
    subtitle,
    publicationDate,
    keywords,
    abstract,
  } = request.body;

  const paper = await updatePaperService.excute({
    id: request.params.id,
    author,
    professor,
    title,
    subtitle,
    publicationDate,
    keywords,
    abstract,
  });

  return response.json(paper);
});

papersRouter.delete('/:id', async (request, response) => {
  const deletePaperService = new DeletePaperService();

  await deletePaperService.execute(request.params.id);

  return response.status(204).send();
});

export default papersRouter;
