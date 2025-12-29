import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { TestHelpers } from '../test-helpers';
import { TestDatabase } from '../test-db.config';
import { NotificationStrategy } from '../../src/notifications/strategies/notification-strategy';

const NOTIFICATIONS_ROUTE = '/notifications';

describe('POST /notifications (e2e)', () => {
    let app: INestApplication<App>;
    let authToken: string;
    let userId: string;

    const mockEmailStrategy = {
        channel: 'email',
        send: jest.fn().mockResolvedValue(undefined),
    };

    const mockSmsStrategy = {
        channel: 'sms',
        send: jest.fn().mockResolvedValue(undefined),
    };

    const mockPushStrategy = {
        channel: 'push_notification',
        send: jest.fn().mockResolvedValue(undefined),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(NotificationStrategy)
            .useValue([mockEmailStrategy, mockSmsStrategy, mockPushStrategy])
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
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

        jest.clearAllMocks();
    });

    it('should create notification with email channel', async () => {
        const notificationData = {
            title: 'Email Notification',
            content: 'Test email notification content',
            channel: 'email',
        };

        const response = await request(app.getHttpServer())
            .post(NOTIFICATIONS_ROUTE)
            .set('Authorization', `Bearer ${authToken}`)
            .send(notificationData)
            .expect(201);

        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('notification');
        expect(response.body.notification).toHaveProperty('id');
    });

    it('should create notification with sms channel', async () => {
        const notificationData = {
            title: 'SMS Notification',
            content: 'Test SMS content',
            channel: 'sms',
        };

        const response = await request(app.getHttpServer())
            .post(NOTIFICATIONS_ROUTE)
            .set('Authorization', `Bearer ${authToken}`)
            .send(notificationData)
            .expect(201);

        expect(response.body).toHaveProperty('notification');
    });

    it('should create notification with push_notification channel', async () => {
        const notificationData = {
            title: 'Push Notification',
            content: 'Test push content',
            channel: 'push_notification',
        };

        const response = await request(app.getHttpServer())
            .post(NOTIFICATIONS_ROUTE)
            .set('Authorization', `Bearer ${authToken}`)
            .send(notificationData)
            .expect(201);

        expect(response.body).toHaveProperty('notification');
    });

    it('should save notification in database', async () => {
        const notificationData = {
            title: 'Strategy Test',
            content: 'Testing strategy pattern',
            channel: 'email',
        };

        await request(app.getHttpServer())
            .post(NOTIFICATIONS_ROUTE)
            .set('Authorization', `Bearer ${authToken}`)
            .send(notificationData);

        const prisma = await TestDatabase.getPrismaClient();
        const notifications = await prisma.notifications.findMany({
            where: { userId },
        });

        expect(notifications).toHaveLength(1);
        expect(notifications[0].title).toBe(notificationData.title);
        expect(notifications[0].channel).toBe(notificationData.channel);
    });

    it('should return 401 without JWT token', async () => {
        const notificationData = {
            title: 'Test',
            content: 'Test content',
            channel: 'email',
        };

        await request(app.getHttpServer())
            .post(NOTIFICATIONS_ROUTE)
            .send(notificationData)
            .expect(401);
    });

    it('should validate required fields', async () => {
        const response = await request(app.getHttpServer())
            .post(NOTIFICATIONS_ROUTE)
            .set('Authorization', `Bearer ${authToken}`)
            .send({})
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });

    it('should validate channel is valid', async () => {
        const invalidData = {
            title: 'Test',
            content: 'Test content',
            channel: 'invalid_channel',
        };

        const response = await request(app.getHttpServer())
            .post(NOTIFICATIONS_ROUTE)
            .set('Authorization', `Bearer ${authToken}`)
            .send(invalidData)
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });

    it('should handle null body gracefully', async () => {
        const response = await request(app.getHttpServer())
            .post('/notifications')
            .set('Authorization', `Bearer ${authToken}`)
            .send(null as any)
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });
});
