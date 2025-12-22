import { Injectable, Logger } from '@nestjs/common';
import { NotificationStrategy, SendNotificationData } from './notification-strategy';

@Injectable()
export class SmsNotificationStrategy extends NotificationStrategy {
    private readonly logger = new Logger(SmsNotificationStrategy.name);
    readonly channel: string = 'sms';

    async send(data: SendNotificationData): Promise<void> {
        this.logger.log('Sending sms notification');
    }
}
