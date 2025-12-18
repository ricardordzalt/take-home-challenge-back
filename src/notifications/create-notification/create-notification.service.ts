import { Injectable } from '@nestjs/common';
import { Channel, NotificationsRepository } from '../repositories/notifications.repository';

type User = {
  id: string;
};

type createNotificationData = {
  title: string;
  content: string;
  channel: Channel;
};

type CreateNotificationResponse = {
  message: string[];
  statusCode: number;
  notification: {
    id: string;
  };
};

@Injectable()
export class CreateNotificationService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository
  ) { }
  async createNotification(
    user: User,
    createNotificationData: createNotificationData,
  ): Promise<CreateNotificationResponse> {
    const { title, content, channel } = createNotificationData || {};
    const { id: userId } = user || {};
    const notificationData = {
      title,
      content,
      channel,
      userId,
    };
    const notification = await this.notificationsRepository.create(notificationData);
    const response = {
      message: ['Notification created successfully'],
      statusCode: 201,
      notification: {
        id: notification.id,
      },
    }
    return response;
  }
}
