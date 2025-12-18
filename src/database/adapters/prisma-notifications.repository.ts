import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotificationsRepository,
  Notification,
  CreateNotificationParams,
  UpdateNotificationData,
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

  async update(id: string, data: UpdateNotificationData): Promise<Notification> {
    return this.prisma.notifications.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        channel: data.channel,
      },
    });
  }

  async findById(id: string): Promise<Notification> {
    const notification = await this.prisma.notifications.findUnique({
      where: { id },
    });
    return notification as Notification;
  }
}
