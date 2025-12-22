import { Injectable, Logger, BadRequestException, Inject } from '@nestjs/common';
import { Channel, NotificationsRepository } from '../repositories/notifications.repository';
import { NotificationStrategy } from '../strategies/notification-strategy';

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
  private readonly strategies: Record<Channel, NotificationStrategy>;

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    @Inject(NotificationStrategy)
    strategies: NotificationStrategy[],
  ) {
    this.strategies = strategies.reduce((acc, strategy) => {
      acc[strategy.channel] = strategy;
      return acc;
    }, {} as Record<Channel, NotificationStrategy>);
  }

  async execute(
    user: User,
    createNotificationData: createNotificationData,
  ): Promise<CreateNotificationResponse> {
    const { channel } = createNotificationData || {};
    const { id: userId } = user || {};

    await this.sendNotification({ createNotificationData, userId });

    const notification = await this.saveNotification({ createNotificationData, userId });

    const response = {
      message: [
        'Notification created successfully',
        `Notification sent successfully by ${channel} channel`
      ],
      statusCode: 201,
      notification: {
        id: notification.id,
      },
    };

    return response;
  }

  private async sendNotification({
    createNotificationData,
    userId,
  }: {
    createNotificationData: createNotificationData;
    userId: string;
  }): Promise<void> {
    const { title, content, channel } = createNotificationData;
    const strategy = this.strategies[channel];

    if (!strategy) {
      this.logger.error(`Invalid notification channel: ${channel}`);
      throw new BadRequestException(`Invalid notification channel: ${channel}`);
    }

    this.logger.log(`Processing notification send in ${channel} channel`);
    await strategy.send({
      title,
      content,
      userId,
    });
    this.logger.log('Notification sent');
  }

  private async saveNotification({
    createNotificationData,
    userId,
  }: {
    createNotificationData: createNotificationData;
    userId: string;
  }) {
    const { title, content, channel } = createNotificationData;
    const notificationData = {
      title,
      content,
      channel,
      userId,
    };
    this.logger.log(`Creating notification data: ${JSON.stringify(notificationData, null, 3)}`);
    const notification = await this.notificationsRepository.create(notificationData);
    this.logger.log(`Notification: ${notification.id}, created successfully`);
    return notification;
  }
}
