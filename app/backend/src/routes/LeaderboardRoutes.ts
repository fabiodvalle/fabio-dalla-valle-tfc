import { Request, Response, Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const router = Router();

router.get('/home', (req: Request, res: Response) => LeaderboardController
  .getAllMatchesHome(req, res));
router.get('/away', (req: Request, res: Response) => LeaderboardController
  .getAllMatchesAway(req, res));
router.get('/', (req: Request, res: Response) => LeaderboardController
  .getLeaderboard(req, res));
export default router;
