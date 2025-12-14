import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository, User, CreateUserParams } from '../../users/repositories/user.repository';


@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateUserParams): Promise<User> {
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
            } as any,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
}
