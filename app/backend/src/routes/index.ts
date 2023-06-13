import { Router } from 'express';
import teamRouter from './TeamsRoutes';

const router = Router();

router.use('/teams', teamRouter);

export default router;
