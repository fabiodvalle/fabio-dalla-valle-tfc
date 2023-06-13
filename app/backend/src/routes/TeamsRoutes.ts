import { Request, Response, Router } from 'express';
import TeamsController from '../controllers/TeamsController';

const router = Router();

router.get('/', (req: Request, res: Response) => TeamsController.getAllTeams(req, res));

export default router;
