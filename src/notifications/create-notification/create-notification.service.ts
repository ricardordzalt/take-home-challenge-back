import { Injectable } from '@nestjs/common';

type User = {
  id: string;
};

type createNotificationData = {
  title: string;
  content: string;
  channel: string;
};

@Injectable()
export class CreateNotificationService {
  async createNotification(
    user: User,
    createNotificationData: createNotificationData,
  ) {
    return createNotificationData;
  }
}
