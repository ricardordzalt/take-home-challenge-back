import { Injectable, ConflictException } from '@nestjs/common';
import { HashService } from '../shared/hash/hash.service';
import { UsersRepository } from 'src/users/repositories/users.repository';

type RegistrationData = {
  email: string;
  password: string;
};

@Injectable()
export class RegisterService {
  constructor(
    private readonly hashService: HashService,
    private readonly usersRepository: UsersRepository,
  ) { }
  async register(registrationData: RegistrationData): Promise<void> {
    const user = await this.usersRepository.findByEmail(registrationData.email);
    if (user) {
      throw new ConflictException({
        error: 'USER_ALREADY_EXISTS',
      });
    }
    const { password, email } = registrationData || {};
    const hashedPassword = await this.hashService.hash({
      password,
    });

    await this.usersRepository.create({
      email,
      password: hashedPassword,
    });
  }
}
