import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import UsersModel from '../database/models/UsersModel';

export default class UsersService {
  public static async login(
    email: string,
    password: string,
  ): Promise<ServiceResponse<{ token: string }>> {
    const user = await UsersModel.findOne({ where: { email } });
    if (!user) return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };

    const verifyPassword = bcryptjs.compareSync(password, user.password);

    if (!verifyPassword) {
      return {
        status: 'UNAUTHORIZED',
        data: { message: 'Invalid email or password' },
      };
    }

    const { role } = user;
    const token = jwt.sign({ email, role }, 'jwt_secret');
    return { status: 'SUCCESSFUL', data: { token } };
  }
}
