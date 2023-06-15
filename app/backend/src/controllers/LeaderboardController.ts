import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';
import TeamsService from '../services/TeamsService';
import ITeams from '../Interfaces/ITeams';

export default class LeaderboardController {
  static async getAllMatches(req: Request, res: Response) {
    // const { id } = req.params;
    const teams = await TeamsService.getAllTeams();
    const matches = await Promise.all(teams.map(async (t: ITeams) => {
      const match = await LeaderboardService.getFineshedMatchesHome(t.id);
      return match;
    }));

    return res.status(200).json(matches);
  }
}
