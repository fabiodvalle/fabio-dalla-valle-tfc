import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  static async getAllTeams(req: Request, res: Response) {
    const response = await TeamsService.getAllTeams();
    return res.status(200).json(response);
  }

  static async getTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const response = await TeamsService.getTeamById(+id);
    console.log('id', id);
    console.log('res', response);
    return res.status(200).json(response);
  }
}
