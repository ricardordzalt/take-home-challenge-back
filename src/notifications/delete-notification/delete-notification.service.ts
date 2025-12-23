import { HttpStatus, Injectable, NotFoundException, Logger, ForbiddenException } from '@nestjs/common';
import { NotificationsRepository } from '../repositories/notifications.repository';

type User = {
  id: string;
};

type DeleteNotificationResponse = {
  message: string[];
  statusCode: HttpStatus;
};

@Injectable()
export class DeleteNotificationService {
  private readonly logger = new Logger(DeleteNotificationService.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository
  ) { }
  async execute(
    notificationId: string,
    user: User,
  ): Promise<DeleteNotificationResponse> {
    const notification = await this.notificationsRepository.findById(notificationId);
    if (!notification) {
      this.logger.error(`Notification: ${notificationId}, not found`);
      throw new NotFoundException({ message: ['Notification not found'] });
    }
    if (notification.userId !== user.id) {
      this.logger.error(`User: ${user.id}, is not authorized to delete notification: ${notificationId}`);
      throw new ForbiddenException({ message: ['You are not authorized to delete this notification'] });
    }
    await this.notificationsRepository.delete(notificationId);
    this.logger.log(`Notification: ${notification.id}, deleted successfully`);
    const response = {
      message: ['Notification deleted successfully'],
      statusCode: HttpStatus.OK,
    }
    return response;
  }
}
