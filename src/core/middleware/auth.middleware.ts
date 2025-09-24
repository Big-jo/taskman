import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { AuthUser, ExtendedRequest } from "../types";
import { UsersService } from "../../modules/users/users.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const user = await this.usersService.findById(decoded.id);
      (req as unknown as ExtendedRequest).user = user as AuthUser;
      next();
    } catch (error) {
      this.handleJwtError(error);
    }
  }

  private handleJwtError(error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('Invalid token');
    }

    console.log(error);

    throw new UnauthorizedException('Invalid or expired token');
  }
}