import { Module } from '@nestjs/common';
import { CreateNotificationService } from './create-notification/create-notification.service';
import { CreateNotificationController } from './create-notification/create-notification.controller';
import { UpdateNotificationService } from './update-notification/update-notification.service';
import { UpdateNotificationController } from './update-notification/update-notification.controller';

@Module({
  providers: [
    CreateNotificationService,
    UpdateNotificationService
  ],
  controllers: [
    CreateNotificationController,
    UpdateNotificationController
  ]
})
export class NotificationsModule {}
