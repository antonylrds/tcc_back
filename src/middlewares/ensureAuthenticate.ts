import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  subject: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT is missing');
  }

  const [, token] = authHeader.split(' ');

  const decoded = verify(token, authConfig.secret);

  const { subject } = decoded as TokenPayload;

  request.user = {
    id: subject,
  };

  return next();
}
