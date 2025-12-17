import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotificationsRepository,
  Notification,
  CreateNotificationParams,
} from '../../notifications/repositories/notifications.repository';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateNotificationParams): Promise<Notification> {
    return this.prisma.notifications.create({
      data: {
        title: data.title,
        content: data.content,
        channel: data.channel,
        userId: data.userId,
      },
    });
  }
}
