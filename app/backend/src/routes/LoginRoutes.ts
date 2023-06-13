import { Request, Response, Router } from 'express';
import UsersController from '../controllers/UsersController';
import verifyLogin from '../middlewares/verifyLogin';

const router = Router();

router.post('/', verifyLogin, (req: Request, res: Response) => UsersController.login(req, res));

export default router;
