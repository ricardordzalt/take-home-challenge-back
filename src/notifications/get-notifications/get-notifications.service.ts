import { HttpStatus, Injectable } from '@nestjs/common';
import { Notification, NotificationsRepository } from '../repositories/notifications.repository'

type GetNotificationsResponse = {
    notifications: Notification[];
    statusCode: HttpStatus;
}

type User = {
    id: string;
}

@Injectable()
export class GetNotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(user: User): Promise<GetNotificationsResponse> {
    const userNotifications = await this.notificationsRepository.findByUserId(user.id);
    const response = {
        notifications: userNotifications,
        statusCode: HttpStatus.OK
    }
    return response;
  }
}
