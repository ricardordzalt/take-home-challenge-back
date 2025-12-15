import { Module } from '@nestjs/common';
import { CreateNotificationService } from './create-notification/create-notification.service';
import { CreateNotificationController } from './create-notification/create-notification.controller';

@Module({
  providers: [CreateNotificationService],
  controllers: [CreateNotificationController]
})
export class NotificationsModule {}
