import { Request, Response, NextFunction } from 'express';
import JWT from '../utils/jwt';

export default async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response<string>> => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token not found' });
  }
  const validate = await JWT.verify(authorization);
  if (validate === 'Token must be a valid token') {
    return res.status(401).json({ message: validate });
  }
  return next();
};
