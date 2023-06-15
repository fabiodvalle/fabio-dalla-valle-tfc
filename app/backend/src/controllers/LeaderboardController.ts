import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';
import TeamsService from '../services/TeamsService';
import ITeams from '../Interfaces/ITeams';
import ILeaderboard from '../Interfaces/ILeaderboard';

const sort = (matches: ILeaderboard[]) => matches.sort((a, b) => {
  if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
  if (a.totalVictories !== b.totalVictories) return b.totalVictories - a.totalVictories;
  if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
  return b.goalsFavor - a.goalsFavor;
});

export default class LeaderboardController {
  static async getAllMatchesHome(req: Request, res: Response) {
    const teams = await TeamsService.getAllTeams();
    const matches = await Promise.all(teams.map(async (t: ITeams) => {
      const match = await LeaderboardService.getFineshedMatchesHome(t.id);
      return match;
    }));
    sort(matches);

    return res.status(200).json(matches);
  }

  static async getAllMatchesAway(req: Request, res: Response) {
    const teams = await TeamsService.getAllTeams();
    const matches = await Promise.all(teams.map(async (t: ITeams) => {
      const match = await LeaderboardService.getFineshedMatchesAway(t.id);
      return match;
    }));
    sort(matches);

    return res.status(200).json(matches);
  }
}
