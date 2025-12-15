import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from 'src/users/repositories/user.repository';
import { HashService } from '../shared/hash/hash.service';
import { TokenService } from '../shared/token/token.service';
import { ConfigService } from '@nestjs/config';

type LoginData = {
    email: string;
    password: string;
}

@Injectable()
export class LoginService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashService: HashService,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
        private readonly logger: Logger,
    ) { }

    async login(loginData: LoginData) {
        const { email, password } = loginData;
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            this.logger.error('User not found');
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await this.hashService.compare({
            password,
            hashed: user.password as string
        });

        if (!isPasswordValid) {
            this.logger.error('Invalid password');
            throw new UnauthorizedException('Invalid password');
        }

        const accessTokenPayload = {
            id: user.id,
        }
        const accessTokenOptions = {
            expiresIn: '7d' as `${number}d`,
        }
        const accessToken = this.tokenService.generateToken({
            payload: accessTokenPayload,
            options: accessTokenOptions,
        });
        this.logger.log("Access granted for user: " + user.email);

        return {
            access_token: accessToken,
        };
    }
}
