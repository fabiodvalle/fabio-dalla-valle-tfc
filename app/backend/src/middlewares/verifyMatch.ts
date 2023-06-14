import { Request, Response, NextFunction } from 'express';

export default async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response<string>> => {
  const { homeTeamId, awayTeamId } = req.body;

  if (homeTeamId === awayTeamId) {
    return res
      .status(422)
      .json({ message: 'It is not possible to create a match with two equal teams' });
  }

  return next();
};
