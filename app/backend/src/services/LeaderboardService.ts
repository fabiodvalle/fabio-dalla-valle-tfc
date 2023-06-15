import MatchesModel from '../database/models/MatchesModel';
import ITeams from '../Interfaces/ITeams';
import TeamsModel from '../database/models/TeamsModel';
import IMatches from '../Interfaces/IMatches';
// import TeamsService from './TeamsService';
import ILeaderboard from '../Interfaces/ILeaderboard';

type obj = {
  points: number;
  victories: number;
  draws: number;
  gf: number;
  go: number;
  team: { teamName: string };
  totalGames: number;
};

export default class LeaderBoardService {
  public static getAllTeams(): Promise<ITeams[]> {
    return TeamsModel.findAll();
  }

  public static async getTeamById(id: number): Promise<ITeams> {
    const response = await TeamsModel.findByPk(id) as unknown as ITeams;
    return response;
  }

  static mapMatchesHome = (matches: IMatches[]) => {
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
      .mapMatchesHome(matchesHome);
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

  static mapMatchesAway = (matches: IMatches[]) => {
    let countVictories = 0;
    let countDraws = 0;
    let countGoalsFavor = 0;
    let countGoalsOwn = 0;
    matches.map((match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        countVictories += 1;
      }
      if (match.homeTeamGoals === match.awayTeamGoals) {
        countDraws += 1;
      }
      countGoalsFavor += match.awayTeamGoals;
      countGoalsOwn += match.homeTeamGoals;
      return { countDraws, countVictories, countGoalsFavor, countGoalsOwn };
    });
    return { countDraws, countVictories, countGoalsFavor, countGoalsOwn };
  };

  public static async getFineshedMatchesAway(id: number): Promise<ILeaderboard> {
    const matchesHome = await MatchesModel.findAll({ where: { inProgress: 0, awayTeamId: id } });
    const team = await LeaderBoardService.getTeamById(id);
    const totalGames = matchesHome.length;
    const { countDraws, countVictories, countGoalsFavor, countGoalsOwn } = LeaderBoardService
      .mapMatchesAway(matchesHome);
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

  public static returnObj = ({ points, victories, draws, gf, go, team, totalGames }: obj) => {
    const obj = {
      name: team.teamName,
      totalPoints: points,
      totalGames,
      totalVictories: victories,
      totalDraws: draws,
      totalLosses: totalGames - victories - draws,
      goalsFavor: gf,
      goalsOwn: go,
      goalsBalance: gf - go,
      efficiency: Number((100 * (points / (totalGames * 3))).toFixed(2)),
    };
    return obj;
  };

  public static async getLeaderboard(id: number): Promise<ILeaderboard> {
    const matchesAway = await MatchesModel.findAll({ where: { inProgress: 0, awayTeamId: id } });
    const matchesHome = await MatchesModel.findAll({ where: { inProgress: 0, homeTeamId: id } });
    const team = await LeaderBoardService.getTeamById(id);
    const totalGames = matchesHome.length + matchesAway.length;
    const mapAway = LeaderBoardService.mapMatchesAway(matchesAway);
    const mapHome = LeaderBoardService.mapMatchesHome(matchesHome);

    const points = (mapAway.countVictories + mapHome.countVictories) * 3
      + mapAway.countDraws + mapHome.countDraws;
    const victories = mapAway.countVictories + mapHome.countVictories;
    const draws = mapAway.countDraws + mapHome.countDraws;
    const gf = mapAway.countGoalsFavor + mapHome.countGoalsFavor;
    const go = mapAway.countGoalsOwn + mapHome.countGoalsOwn;

    return LeaderBoardService.returnObj({ points, victories, draws, gf, go, team, totalGames });
  }
}
