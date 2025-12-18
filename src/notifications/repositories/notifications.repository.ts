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

export type UpdateNotificationData = {
  title?: string;
  content?: string;
  channel?: Channel;
};

export abstract class NotificationsRepository {
  abstract create(data: CreateNotificationParams): Promise<Notification>;
  abstract update(id: string, data: UpdateNotificationData): Promise<Notification>;
  abstract findById(id: string): Promise<Notification>;
  abstract delete(id: string): Promise<void>;
  abstract findByUserId(userId: string): Promise<Notification[]>;
}
