import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { TestHelpers } from '../test-helpers';
import { TestDatabase } from '../test-db.config';

const AUTH_REGISTER = '/auth/register';

describe('POST /auth/register (e2e)', () => {
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

    it('should register a new user with valid data', async () => {
        const registerData = {
            email: 'newuser@example.com',
            password: 'SecurePassword123!',
        };

        const response = await request(app.getHttpServer())
            .post(AUTH_REGISTER)
            .send(registerData)
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('User registered successfully');

        const prisma = await TestDatabase.getPrismaClient();
        const user = await prisma.users.findUnique({
            where: { email: registerData.email },
        });
        expect(user).toBeDefined();
        expect(user?.email).toBe(registerData.email);
    });

    it('should return 409 if email already exists', async () => {
        const userData = {
            email: 'existing@example.com',
            password: 'Password123!',
        };

        await TestHelpers.createTestUser(userData);

        const response = await request(app.getHttpServer())
            .post(AUTH_REGISTER)
            .send(userData);

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message');
    });

    it('should hash the password', async () => {
        const registerData = {
            email: 'hashtest@example.com',
            password: 'PlainPassword123!',
        };

        await request(app.getHttpServer())
            .post(AUTH_REGISTER)
            .send(registerData)
            .expect(201);

        const prisma = await TestDatabase.getPrismaClient();
        const user = await prisma.users.findUnique({
            where: { email: registerData.email },
        });

        expect(user?.password).toBeDefined();
        expect(user?.password).not.toBe(registerData.password);
    });

    it('should validate email format', async () => {
        const invalidData = {
            email: 'not-an-email',
            password: 'Password123!',
        };

        const response = await request(app.getHttpServer())
            .post(AUTH_REGISTER)
            .send(invalidData)
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });

    it('should validate required fields', async () => {
        const response = await request(app.getHttpServer())
            .post(AUTH_REGISTER)
            .send({})
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });

    it('should handle null body gracefully in service', async () => {
        const response = await request(app.getHttpServer())
            .post(AUTH_REGISTER)
            .send(null as any)
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });
});
