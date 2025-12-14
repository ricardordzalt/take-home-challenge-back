import { Injectable, ConflictException } from '@nestjs/common';
import { HashService } from '../shared/hash/hash.service';
import { UserRepository } from 'src/users/repositories/user.repository';

type RegistrationData = {
    email: string;
    password: string;
}

@Injectable()
export class RegisterService {
    constructor(
        private readonly hashService: HashService,
        private readonly userRepository: UserRepository,
    ) { }
    async register(registrationData: RegistrationData): Promise<void> {
        const user = await this.userRepository.findByEmail(registrationData.email);
        if (user) {
            throw new ConflictException({
                error: 'USER_ALREADY_EXISTS',
            });
        }
        const { password, email } = registrationData || {};
        const hashedPassword = await this.hashService.hash({
            password,
        });

        await this.userRepository.create({
            email,
            password: hashedPassword,
        });
    }
}
