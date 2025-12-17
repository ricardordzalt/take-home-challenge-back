import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import type {JwtPayload} from '../interfaces/jwt-payload.interface';

export const User = createParamDecorator(
  (
    data: keyof JwtPayload | undefined,
    ctx: ExecutionContext,
  ): JwtPayload | string => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    return data ? user?.[data] : user;
  },
);
