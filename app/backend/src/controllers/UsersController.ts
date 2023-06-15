import { Request, Response } from 'express';
import UsersService from '../services/UsersService';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import JWT from '../utils/jwt';

export default class UsersController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const response = await UsersService.login(email, password);

    if (response.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(response.status)).json(response.data);
    }

    return res.status(200).json(response.data);
  }

  static async roleLogin(req: Request, res: Response) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }
    const response = await JWT.verify(authorization);

    // console.log('response', (response));

    return res.status(200).json({ role: JSON.parse(JSON.stringify(response)).role });
  }
}
