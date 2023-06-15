import MatchesModel from '../database/models/MatchesModel';
import ITeams from '../Interfaces/ITeams';
import TeamsModel from '../database/models/TeamsModel';
import IMatches from '../Interfaces/IMatches';
// import TeamsService from './TeamsService';
import ILeaderboard from '../Interfaces/ILeaderboard';

export default class LeaderBoardService {
  public static getAllTeams(): Promise<ITeams[]> {
    return TeamsModel.findAll();
  }

  public static async getTeamById(id: number): Promise<ITeams> {
    const response = await TeamsModel.findByPk(id) as unknown as ITeams;
    return response;
  }

  static mapMatches = (matches: IMatches[]) => {
    let countVictories = 0;
    let countDraws = 0;
    let countGoalsFavor = 0;
    let countGoalsOwn = 0;
    matches.map((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        countVictories += 1;
      }
      if (match.homeTeamGoals === match.awayTeamGoals) {
        countDraws += 1;
      }
      countGoalsFavor += match.homeTeamGoals;
      countGoalsOwn += match.awayTeamGoals;
      return { countDraws, countVictories, countGoalsFavor, countGoalsOwn };
    });
    return { countDraws, countVictories, countGoalsFavor, countGoalsOwn };
  };

  public static async getFineshedMatchesHome(id: number): Promise<ILeaderboard> {
    const matchesHome = await MatchesModel.findAll({ where: { inProgress: 0, homeTeamId: id } });
    const team = await LeaderBoardService.getTeamById(id);
    const totalGames = matchesHome.length;
    const { countDraws, countVictories, countGoalsFavor, countGoalsOwn } = LeaderBoardService
      .mapMatches(matchesHome);
    const totalPoints = countVictories * 3 + countDraws;
    // const efficiency = (100 * (totalPoints / (totalGames * 3))).toFixed(2);
    return {
      name: team.teamName,
      totalPoints,
      totalGames,
      totalVictories: countVictories,
      totalDraws: countDraws,
      totalLosses: totalGames - countVictories - countDraws,
      goalsFavor: countGoalsFavor,
      goalsOwn: countGoalsOwn,
      goalsBalance: countGoalsFavor - countGoalsOwn,
      efficiency: Number((100 * (totalPoints / (totalGames * 3))).toFixed(2)),
    };
  }
}
