import {Module, Global} from '@nestjs/common';
import {PrismaService} from './prisma/prisma.service';
import {UsersRepository} from '../users/repositories/users.repository';
import {PrismaUsersRepository} from './adapters/prisma-users.repository';
import {NotificationsRepository} from '../notifications/repositories/notifications.repository';
import {PrismaNotificationsRepository} from './adapters/prisma-notifications.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [UsersRepository, NotificationsRepository, PrismaService],
})
export class DatabaseModule {}
