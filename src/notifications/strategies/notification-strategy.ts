export interface SendNotificationData {
    title: string;
    content: string;
    userId: string;
}

export abstract class NotificationStrategy {
    abstract readonly channel: string;
    abstract send(data: SendNotificationData): Promise<void>;
}
