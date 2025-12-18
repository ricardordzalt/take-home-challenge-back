import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UsersRepository,
  User,
  CreateUserParams,
} from '../../users/repositories/users.repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateUserParams): Promise<User> {
    return this.prisma.users.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }
}
