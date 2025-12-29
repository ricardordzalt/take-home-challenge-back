import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { TestHelpers } from '../test-helpers';
import { TestDatabase } from '../test-db.config';

const AUTH_LOGIN = '/auth/login';

describe('POST /auth/login (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        app = await TestHelpers.createTestApp(AppModule);
    });

    afterAll(async () => {
        await TestDatabase.disconnect();
        await app.close();
    });

    beforeEach(async () => {
        await TestHelpers.cleanDatabase();
    });

    it('should authenticate user with valid credentials', async () => {
        const userData = {
            email: 'logintest@example.com',
            password: 'ValidPassword123!',
        };

        await TestHelpers.createTestUser(userData);

        const response = await request(app.getHttpServer())
            .post(AUTH_LOGIN)
            .send({
                email: userData.email,
                password: userData.password,
            })
            .expect(201);

        expect(response.body).toHaveProperty('access_token');
        expect(typeof response.body.access_token).toBe('string');
    });

    it('should return 401 with invalid password', async () => {
        const userData = {
            email: 'logintest2@example.com',
            password: 'CorrectPassword123!',
        };

        await TestHelpers.createTestUser(userData);

        const response = await request(app.getHttpServer())
            .post(AUTH_LOGIN)
            .send({
                email: userData.email,
                password: 'WrongPassword123!',
            })
            .expect(401);

        expect(response.body).toHaveProperty('message');
    });

    it('should return 401 when user does not exist', async () => {
        const response = await request(app.getHttpServer())
            .post(AUTH_LOGIN)
            .send({
                email: 'nonexistent@example.com',
                password: 'SomePassword123!',
            })
            .expect(401);

        expect(response.body).toHaveProperty('message');
    });

    it('should validate email format', async () => {
        const response = await request(app.getHttpServer())
            .post(AUTH_LOGIN)
            .send({
                email: 'invalid-email',
                password: 'Password123!',
            })
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });

    it('should validate required fields', async () => {
        const response = await request(app.getHttpServer())
            .post(AUTH_LOGIN)
            .send({})
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });

    it('should handle null body', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(null as any)
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });
});
