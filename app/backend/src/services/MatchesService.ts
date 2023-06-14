import TeamsModel from '../database/models/TeamsModel';
import IMatches from '../Interfaces/IMatches';
import MatchesModel from '../database/models/MatchesModel';
// import { Includeable } from 'sequelize';

export default class MatchesService {
  public static getAllMatches(): Promise<IMatches[]> {
    return MatchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
  }

  public static getInProgressMatches(): Promise<IMatches[]> {
    return MatchesModel.findAll({
      where: { inProgress: 1 },
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
  }

  public static getFineshedMatches(): Promise<IMatches[]> {
    return MatchesModel.findAll({
      where: { inProgress: 0 },
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
  }
}
