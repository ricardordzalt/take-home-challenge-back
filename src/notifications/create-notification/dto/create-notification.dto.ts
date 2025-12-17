import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum NotificationChannel {
  EMAIL = 'email',
  PUSH_NOTIFICATION = 'push_notification',
  SMS = 'sms',
}

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;
}
