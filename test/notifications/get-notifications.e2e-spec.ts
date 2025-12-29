import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { TestHelpers } from '../test-helpers';
import { TestDatabase } from '../test-db.config';

const NOTIFICATIONS_ROUTE = '/notifications';

describe('GET /notifications (e2e)', () => {
    let app: INestApplication<App>;
    let authToken: string;
    let userId: string;
    let otherUserId: string;

    beforeAll(async () => {
        app = await TestHelpers.createTestApp(AppModule);
    });

    afterAll(async () => {
        await TestDatabase.disconnect();
        await app.close();
    });

    beforeEach(async () => {
        await TestHelpers.cleanDatabase();

        const user = await TestHelpers.createTestUser({
            email: 'testuser@example.com',
            password: 'TestPassword123!',
        });
        userId = user.id;
        authToken = TestHelpers.generateJwtToken({ id: userId });

        const otherUser = await TestHelpers.createTestUser({
            email: 'otheruser@example.com',
            password: 'OtherPassword123!',
        });
        otherUserId = otherUser.id;
    });

    it('should return all notifications for authenticated user', async () => {
        await TestHelpers.createTestNotification({
            userId,
            title: 'Test Notification 1',
            content: 'Test Content 1',
            channel: 'email',
        });
        await TestHelpers.createTestNotification({
            userId,
            title: 'Test Notification 2',
            content: 'Test Content 2',
            channel: 'sms',
        });

        const response = await request(app.getHttpServer())
            .get(NOTIFICATIONS_ROUTE)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        const notificationsResponse = response.body.notifications;

        expect(Array.isArray(notificationsResponse)).toBe(true);
        expect(notificationsResponse).toHaveLength(2);
        expect(notificationsResponse[0]).toHaveProperty('id');
        expect(notificationsResponse[0]).toHaveProperty('title');
        expect(notificationsResponse[0]).toHaveProperty('content');
        expect(notificationsResponse[0]).toHaveProperty('channel');
    });

    it('should return empty array if user has no notifications', async () => {
        const response = await request(app.getHttpServer())
            .get(NOTIFICATIONS_ROUTE)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        const notificationsResponse = response.body.notifications;
        expect(Array.isArray(notificationsResponse)).toBe(true);
        expect(notificationsResponse).toHaveLength(0);
    });

    it('should return 401 without JWT token', async () => {
        await request(app.getHttpServer())
            .get(NOTIFICATIONS_ROUTE)
            .expect(401);
    });

    it('should not return notifications from other users', async () => {
        await TestHelpers.createTestNotification({
            userId: otherUserId,
            title: 'Other User Notification',
            content: 'Other User Content',
            channel: 'email',
        });

        await TestHelpers.createTestNotification({
            userId,
            title: 'Current User Notification',
            content: 'Current User Content',
            channel: 'email',
        });

        const response = await request(app.getHttpServer())
            .get(NOTIFICATIONS_ROUTE)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        const notificationsResponse = response.body.notifications;

        expect(Array.isArray(notificationsResponse)).toBe(true);
        expect(notificationsResponse).toHaveLength(1);
        expect(notificationsResponse[0].title).toBe('Current User Notification');
    });
});
