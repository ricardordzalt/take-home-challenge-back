import { HttpStatus, Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(GetNotificationsService.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) { }

  async execute(user: User): Promise<GetNotificationsResponse> {
    const userNotifications = await this.notificationsRepository.findByUserId(user.id);
    this.logger.log(`User: ${user.id}, notifications: ${JSON.stringify(userNotifications, null, 3)}, fetched successfully`);
    const response = {
      notifications: userNotifications,
      statusCode: HttpStatus.OK
    }
    return response;
  }
}
