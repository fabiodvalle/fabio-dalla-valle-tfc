import ITeams from '../Interfaces/ITeams';
import TeamsModel from '../database/models/TeamsModel';

export default class TeamsService {
  public static getAllTeams(): Promise<ITeams[]> {
    return TeamsModel.findAll();
  }

  public static async getTeamById(id: number): Promise<ITeams[]> {
    const response = await TeamsModel.findByPk(id) as unknown as ITeams[];
    return response;
  }
}
