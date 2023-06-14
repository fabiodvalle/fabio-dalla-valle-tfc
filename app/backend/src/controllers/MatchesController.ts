import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  static async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress === 'true') {
      const response = await MatchesService.getInProgressMatches();
      return res.status(200).json(response);
    }

    if (inProgress === 'false') {
      const response = await MatchesService.getFineshedMatches();
      return res.status(200).json(response);
    }

    const response = await MatchesService.getAllMatches();
    return res.status(200).json(response);
  }
}
