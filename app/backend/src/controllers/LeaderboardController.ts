import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';
import TeamsService from '../services/TeamsService';
import ITeams from '../Interfaces/ITeams';

export default class LeaderboardController {
  static async getAllMatches(req: Request, res: Response) {
    const teams = await TeamsService.getAllTeams();
    const matches = await Promise.all(teams.map(async (t: ITeams) => {
      const match = await LeaderboardService.getFineshedMatchesHome(t.id);
      return match;
    }));
    matches.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
      if (a.totalVictories !== b.totalVictories) return b.totalVictories - a.totalVictories;
      if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
      return b.goalsFavor - a.goalsFavor;
    });

    return res.status(200).json(matches);
  }
}
