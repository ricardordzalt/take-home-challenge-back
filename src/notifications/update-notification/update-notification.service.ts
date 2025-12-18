import { HttpStatus, Injectable, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import { Channel, NotificationsRepository } from '../repositories/notifications.repository';

type User = {
  id: string;
};

type UpdateNotificationData = {
  title?: string;
  content?: string;
  channel?: Channel;
};

type UpdateNotificationResponse = {
  message: string[];
  statusCode: HttpStatus;
};

@Injectable()
export class UpdateNotificationService {
  private readonly logger = new Logger(UpdateNotificationService.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository
  ) { }
  async execute(
    notificationId: string,
    updateNotificationData: UpdateNotificationData,
    user: User,
  ): Promise<UpdateNotificationResponse> {
    const notification = await this.notificationsRepository.findById(notificationId);
    if (!notification) {
      this.logger.error(`Notification: ${notificationId}, not found`);
      throw new NotFoundException({ message: ['Notification not found'] });
    }
    if (notification.userId !== user.id) {
      this.logger.error(`User: ${user.id}, is not authorized to update notification: ${notificationId}`);
      throw new UnauthorizedException({ message: ['You are not authorized to update this notification'] });
    }
    await this.notificationsRepository.update(notificationId, updateNotificationData);
    this.logger.log(`Notification: ${notificationId}, updated successfully with ${JSON.stringify(updateNotificationData, null, 3)}`);
    const response = {
      message: ['Notification updated successfully'],
      statusCode: HttpStatus.OK,
    }
    return response;
  }
}
