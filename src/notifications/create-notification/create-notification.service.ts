import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(CreateNotificationService.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository
  ) { }
  async execute(
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
    this.logger.log(`Creating notification data: ${JSON.stringify(notificationData, null, 3)}`);
    const notification = await this.notificationsRepository.create(notificationData);
    this.logger.log(`Notification: ${notification.id}, created successfully`);
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
