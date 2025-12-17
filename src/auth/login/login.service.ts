import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { HashService } from '../shared/hash/hash.service';
import { TokenService } from '../shared/token/token.service';

type LoginData = {
  email: string;
  password: string;
};

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) { }

  async login(loginData: LoginData) {
    const { email, password } = loginData;
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await this.hashService.compare({
      password,
      hashed: user.password as string,
    });

    if (!isPasswordValid) {
      this.logger.error('Invalid password');
      throw new UnauthorizedException('Invalid password');
    }

    const accessTokenPayload = {
      id: user.id,
    };
    const accessTokenOptions = {
      expiresIn: '7d' as `${number}d`,
    };
    const accessToken = this.tokenService.generateToken({
      payload: accessTokenPayload,
      options: accessTokenOptions,
    });
    this.logger.log('Access granted for user: ' + user.email);

    return {
      access_token: accessToken,
    };
  }
}
