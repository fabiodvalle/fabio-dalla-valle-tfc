import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';
import TeamsService from '../services/TeamsService';

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

  static async updateMatchFinished(req: Request, res: Response) {
    const { id } = req.params;
    const response = await MatchesService.updateMatchFinished(+id);
    return res.status(200).json(response.data);
  }

  static async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const response = await MatchesService.updateMatch(+id, homeTeamGoals, awayTeamGoals);
    return res.status(200).json(response.data);
  }

  static async createMatch(req: Request, res: Response) {
    const { homeTeamGoals, awayTeamGoals, homeTeamId, awayTeamId } = req.body;

    const homeTeam = await TeamsService.getTeamById(homeTeamId);
    const awayTeam = await TeamsService.getTeamById(awayTeamId);

    if (!homeTeam || !awayTeam) {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }

    const response = await MatchesService
      .createMatch({ homeTeamGoals, awayTeamGoals, homeTeamId, awayTeamId });
    return res.status(201).json(response);
  }
}
