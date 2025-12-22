import { Injectable, Logger } from '@nestjs/common';
import { NotificationStrategy, SendNotificationData } from './notification-strategy';

@Injectable()
export class PushNotificationStrategy extends NotificationStrategy {
    private readonly logger = new Logger(PushNotificationStrategy.name);
    readonly channel: string = 'push_notification';

    async send(data: SendNotificationData): Promise<void> {
        this.logger.log('Sending push notification');
    }
}
