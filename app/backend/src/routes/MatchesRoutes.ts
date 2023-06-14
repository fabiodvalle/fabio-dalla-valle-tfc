import { Request, Response, Router } from 'express';
import MatchesController from '../controllers/MatchesController';

const router = Router();

router.get('/', (req: Request, res: Response) => MatchesController.getAllMatches(req, res));

export default router;
