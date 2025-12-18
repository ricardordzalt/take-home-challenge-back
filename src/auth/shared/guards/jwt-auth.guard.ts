import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../token/token.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UsersRepository } from '../../../users/repositories/users.repository';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly tokenService: TokenService,
        private readonly reflector: Reflector,
        private readonly usersRepository: UsersRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException({
                message: ['Token not provided'],
                statusCode: 401,
                error: 'Unauthorized'
            });
        }

        try {
            const payload = this.tokenService.verifyToken({ token });

            const user = await this.usersRepository.findById(payload.id);

            if (!user) {
                throw new UnauthorizedException({
                    message: ['User doesnt exists'],
                    statusCode: 401,
                    error: 'Unauthorized'
                });
            }

            request.user = payload;
            return true;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException({
                message: ['Invalid or expired token'],
                statusCode: 401,
                error: 'Unauthorized'
            });
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return undefined;
        }

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}
