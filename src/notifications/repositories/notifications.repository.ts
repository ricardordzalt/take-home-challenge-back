export type Channel = 'email' | 'sms' | 'push_notification';

export abstract class Notification {
  id: string;
  title: string;
  content: string;
  channel: Channel;
  userId: string;
}

export type CreateNotificationParams = {
  title: string;
  content: string;
  channel: Channel;
  userId: string;
};

export abstract class NotificationsRepository {
  abstract create(data: CreateNotificationParams): Promise<Notification>;
}
