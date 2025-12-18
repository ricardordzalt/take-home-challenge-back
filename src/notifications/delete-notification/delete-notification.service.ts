import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Channel, NotificationsRepository } from '../repositories/notifications.repository';

type User = {
  id: string;
};

type DeleteNotificationResponse = {
  message: string[];
  statusCode: HttpStatus;
};

@Injectable()
export class DeleteNotificationService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository
  ) { }
  async execute(
    notificationId: string,
    user: User,
  ): Promise<DeleteNotificationResponse> {
    const notification = await this.notificationsRepository.findById(notificationId);
    if(!notification){
      throw new NotFoundException({ message: ['Notification not found'] });
    }
    if(notification.userId !== user.id){
      throw new UnauthorizedException({ message: ['You are not authorized to delete this notification'] });
    }
    await this.notificationsRepository.delete(notificationId);

    const response = {
      message: ['Notification deleted successfully'],
      statusCode: HttpStatus.OK,
    }
    return response;
  }
}
