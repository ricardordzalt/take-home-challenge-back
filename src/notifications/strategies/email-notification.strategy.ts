import { Injectable, Logger } from '@nestjs/common';
import { NotificationStrategy, SendNotificationData } from './notification-strategy';

@Injectable()
export class EmailNotificationStrategy extends NotificationStrategy {
    private readonly logger = new Logger(EmailNotificationStrategy.name);
    readonly channel: string = 'email';

    async send(data: SendNotificationData): Promise<void> {
        this.logger.log('Sending email notification');
    }
}
