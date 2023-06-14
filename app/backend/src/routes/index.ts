import { Router } from 'express';
import teamRouter from './TeamsRoutes';
import loginRouter from './LoginRoutes';
import matchesRouter from './MatchesRoutes';

const router = Router();

router.use('/teams', teamRouter);
router.use('/login', loginRouter);
router.use('/matches', matchesRouter);

export default router;
