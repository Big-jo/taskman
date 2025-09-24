import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../../../modules/users/users.service';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request & { user: any }, res: Response, next: NextFunction) {
    const { user } = req;

    if (!user) {
      throw new ForbiddenException('User is missing');
    }

    req['user'] = user;
    next();
  }
}
