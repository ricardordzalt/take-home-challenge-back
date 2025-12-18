import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
  constructor(
    private readonly notificationsRepository: NotificationsRepository
  ) { }
  async updateNotification(
    notificationId: string,
    updateNotificationData: UpdateNotificationData,
    user: User,
  ): Promise<UpdateNotificationResponse> {
    const notification = await this.notificationsRepository.findById(notificationId);
    if(!notification){
      throw new NotFoundException({ message: ['Notification not found'] });
    }
    if(notification.userId !== user.id){
      throw new UnauthorizedException({ message: ['You are not authorized to update this notification'] });
    }
    await this.notificationsRepository.update(notificationId, updateNotificationData);

    const response = {
      message: ['Notification updated successfully'],
      statusCode: HttpStatus.OK,
    }
    return response;
  }
}
