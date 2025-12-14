import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from '../users/repositories/user.repository';
import { PrismaUserRepository } from './adapters/prisma-user.repository';

@Global()
@Module({
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
    ],
    exports: [UserRepository, PrismaService],
})
export class DatabaseModule { }
