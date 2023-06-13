import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  static async getAllTeams(req: Request, res: Response) {
    const response = TeamsService.getAllTeams();
    return res.status(200).json(response);
  }
}
