import { Injectable, ConflictException } from '@nestjs/common';
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
  constructor(
    private readonly hashService: HashService,
    private readonly usersRepository: UsersRepository,
  ) { }
  async execute(registerInput: RegisterInput): Promise<RegisterResponse> {
    const { password, email } = registerInput || {};
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
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

    const response = { 
      success: true,
      message: ['User registered successfully'], 
    };
    return response;
  }
}
