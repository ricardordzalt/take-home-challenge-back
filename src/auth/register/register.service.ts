import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { HashService } from '../shared/hash/hash.service';
import { UsersRepository } from 'src/users/repositories/users.repository';

type RegisterInput = {
  email: string;
  password: string;
};

type RegisterResponse = {
  success: boolean;
  message: string[];
}

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  constructor(
    private readonly hashService: HashService,
    private readonly usersRepository: UsersRepository,
  ) { }
  async execute(registerInput: RegisterInput): Promise<RegisterResponse> {
    const { password, email } = registerInput || {};
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      this.logger.error('User already exists');
      throw new ConflictException({
        message: ['User already exists'],
      });
    }
    const hashedPassword = await this.hashService.hash({
      password,
    });

    await this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    this.logger.log(`User: ${email}, registered successfully`);

    const response = {
      success: true,
      message: ['User registered successfully'],
    };
    return response;
  }
}
