import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { resolve } from 'path';

import './database';

import routes from './routes';
import AppError from './errors/AppError';

const app = express();
const tmpFolder = resolve(__dirname, '..', 'tmp');

app.use(cors());
app.use('/static', express.static(tmpFolder));
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;
