import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { TestHelpers } from '../test-helpers';
import { TestDatabase } from '../test-db.config';

describe('DELETE /notifications/:notificationId (e2e)', () => {
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

    it('should soft delete notification of the user', async () => {
        const notification = await TestHelpers.createTestNotification({
            userId,
            title: 'To Be Deleted',
            content: 'Delete me',
            channel: 'email',
        });

        await request(app.getHttpServer())
            .delete(`/notifications/${notification.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        const prisma = await TestDatabase.getPrismaClient();
        const deletedNotification = await prisma.notifications.findUnique({
            where: { id: notification.id },
        });

        expect(deletedNotification?.deletedAt).not.toBeNull();
    });

    it('should return 404 if notification does not exist', async () => {
        const fakeId = '00000000-0000-0000-0000-000000000000';

        await request(app.getHttpServer())
            .delete(`/notifications/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(404);
    });

    it('should return 403 if notification belongs to another user', async () => {
        const notification = await TestHelpers.createTestNotification({
            userId: otherUserId,
            title: 'Other User Notification',
            content: 'Other content',
            channel: 'email',
        });

        await request(app.getHttpServer())
            .delete(`/notifications/${notification.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(403);
    });

    it('should return 401 without JWT token', async () => {
        const notification = await TestHelpers.createTestNotification({
            userId,
            title: 'Test',
            content: 'Test content',
            channel: 'email',
        });

        await request(app.getHttpServer())
            .delete(`/notifications/${notification.id}`)
            .expect(401);
    });
});
