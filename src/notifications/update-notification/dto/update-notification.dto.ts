import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum NotificationChannel {
  EMAIL = 'email',
  PUSH_NOTIFICATION = 'push_notification',
  SMS = 'sms',
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;
}
