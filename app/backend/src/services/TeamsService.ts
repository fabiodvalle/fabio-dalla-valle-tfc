import ITeams from '../Interfaces/ITeams';
import TeamsModel from '../database/models/TeamsModel';

export default class TeamsService {
  public static getAllTeams(): Promise<ITeams[]> {
    return TeamsModel.findAll();
  }
}
