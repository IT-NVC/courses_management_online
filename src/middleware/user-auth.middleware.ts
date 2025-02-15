import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { get } from 'lodash';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Optional add user to request object
    const jwtToken = get(req.headers['authorization']?.split(' '), 1, '');
    if (!jwtToken)
      throw new BadRequestException("Access token doesn't not exist");
    let id: any = '';
    try {
      if (!process.env.USER_SECRET_KEY) {
        throw new BadRequestException('Secret key is not defined');
      }
      const decodedToken = verify(jwtToken, process.env.USER_SECRET_KEY) as any;
      const { _id } = decodedToken;
      id = _id.toString();
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    if (id) {
      const user = await this.userService.getUserById(id);
      if (!user) throw new UnauthorizedException('User does not exist');
      req['user'] = user;
    } else {
      throw new BadRequestException("User doesn't not exist");
    }

    next();
  }
}
