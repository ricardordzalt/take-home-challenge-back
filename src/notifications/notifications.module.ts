import { Module } from '@nestjs/common';
import { CreateNotificationService } from './create-notification/create-notification.service';
import { CreateNotificationController } from './create-notification/create-notification.controller';
import { UpdateNotificationService } from './update-notification/update-notification.service';
import { UpdateNotificationController } from './update-notification/update-notification.controller';
import { DeleteNotificationService } from './delete-notification/delete-notification.service';
import { DeleteNotificationController } from './delete-notification/delete-notification.controller';
import { GetNotificationsService } from './get-notifications/get-notifications.service';
import { GetNotificationsController } from './get-notifications/get-notifications.controller';

@Module({
  providers: [
    CreateNotificationService,
    UpdateNotificationService,
    DeleteNotificationService,
    GetNotificationsService,
  ],
  controllers: [
    CreateNotificationController,
    UpdateNotificationController,
    DeleteNotificationController,
    GetNotificationsController
  ]
})
export class NotificationsModule {}
