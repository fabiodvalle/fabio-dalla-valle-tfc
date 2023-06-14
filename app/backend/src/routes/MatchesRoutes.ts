import { Request, Response, Router } from 'express';
import MatchesController from '../controllers/MatchesController';
import verifyAuth from '../middlewares/verifyAuth';
import verifyMatch from '../middlewares/verifyMatch';

const router = Router();

router.get('/', (req: Request, res: Response) => MatchesController.getAllMatches(req, res));
router.patch(
  '/:id/finish',
  verifyAuth,
  (req: Request, res: Response) => MatchesController.updateMatchFinished(req, res),
);
router.patch(
  '/:id',
  verifyAuth,
  (req: Request, res: Response) => MatchesController.updateMatch(req, res),
);
router.post(
  '/',
  verifyAuth,
  verifyMatch,
  (req: Request, res: Response) => MatchesController.createMatch(req, res),
);

export default router;
