import { Request, Response, Router } from 'express';
import UsersController from '../controllers/UsersController';
import verifyLogin from '../middlewares/verifyLogin';
import verifyAuth from '../middlewares/verifyAuth';

const router = Router();

router.post('/', verifyLogin, (req: Request, res: Response) => UsersController.login(req, res));
router.get('/role', verifyAuth, (req: Request, res: Response) => UsersController
  .roleLogin(req, res));

export default router;
