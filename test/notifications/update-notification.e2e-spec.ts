import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { TestHelpers } from '../test-helpers';
import { TestDatabase } from '../test-db.config';

const NOTIFICATIONS_ROUTE = '/notifications';

describe('PUT /notifications/:notificationId (e2e)', () => {
    let app: INestApplication<App>;
    let authToken: string;
    let userId: string;
    let otherUserId: string;
    let otherUserToken: string;

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
        otherUserToken = TestHelpers.generateJwtToken({ id: otherUserId });
    });

    it('should update notification of the user (full update)', async () => {
        const notification = await TestHelpers.createTestNotification({
            userId,
            title: 'Original Title',
            content: 'Original Content',
            channel: 'email',
        });

        const updateData = {
            title: 'Updated Title',
            content: 'Updated Content',
            channel: 'sms',
        };

        const response = await request(app.getHttpServer())
            .put(`${NOTIFICATIONS_ROUTE}/${notification.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updateData)
            .expect(200);

        expect(response.body.notification).toHaveProperty('id');
        expect(response.body.notification.title).toBe(updateData.title);
        expect(response.body.notification.content).toBe(updateData.content);
        expect(response.body.notification.channel).toBe(updateData.channel);

        const prisma = await TestDatabase.getPrismaClient();
        const updatedNotification = await prisma.notifications.findUnique({
            where: { id: notification.id },
        });

        expect(updatedNotification?.title).toBe(updateData.title);
        expect(updatedNotification?.content).toBe(updateData.content);
        expect(updatedNotification?.channel).toBe(updateData.channel);
    });

    it('should update only title', async () => {
        const notification = await TestHelpers.createTestNotification({
            userId,
            title: 'Original Title',
            content: 'Original Content',
            channel: 'email',
        });

        const response = await request(app.getHttpServer())
            .put(`${NOTIFICATIONS_ROUTE}/${notification.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'New Title' })
            .expect(200);

        expect(response.body.notification.title).toBe('New Title');
        expect(response.body.notification.content).toBe('Original Content');
    });

    it('should update only content', async () => {
        const notification = await TestHelpers.createTestNotification({
            userId,
            title: 'Original Title',
            content: 'Original Content',
            channel: 'email',
        });

        const response = await request(app.getHttpServer())
            .put(`${NOTIFICATIONS_ROUTE}/${notification.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ content: 'New Content' })
            .expect(200);

        expect(response.body.notification.title).toBe('Original Title');
        expect(response.body.notification.content).toBe('New Content');
    });

    it('should update only channel', async () => {
        const notification = await TestHelpers.createTestNotification({
            userId,
            title: 'Original Title',
            content: 'Original Content',
            channel: 'email',
        });

        const response = await request(app.getHttpServer())
            .put(`/notifications/${notification.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ channel: 'push_notification' })
            .expect(200);

        expect(response.body.notification.channel).toBe('push_notification');
    });

    it('should return 404 if notification does not exist', async () => {
        const fakeId = '00000000-0000-0000-0000-000000000000';

        await request(app.getHttpServer())
            .put(`${NOTIFICATIONS_ROUTE}/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Updated' })
            .expect(404);
    });

    it('should return 403 if notification belongs to another user', async () => {
        const notification = await TestHelpers.createTestNotification({
            userId: otherUserId,
            title: 'Other User Notification',
            content: 'Other notification content',
            channel: 'email',
        });

        const response = await request(app.getHttpServer())
            .put(`/notifications/${notification.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Trying to Update' })
            .expect(403);

        expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without JWT token', async () => {
        const notification = await TestHelpers.createTestNotification({
            userId,
            title: 'Test',
            content: 'Test content',
            channel: 'email',
        });

        await request(app.getHttpServer())
            .put(`/notifications/${notification.id}`)
            .send({ title: 'Updated' })
            .expect(401);
    });
});
