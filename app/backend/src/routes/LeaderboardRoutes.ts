import { Request, Response, Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const router = Router();

router.get('/home', (req: Request, res: Response) => LeaderboardController.getAllMatches(req, res));

export default router;
