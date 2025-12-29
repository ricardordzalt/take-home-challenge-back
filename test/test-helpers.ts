import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TestDatabase } from './test-db.config';
import * as bcrypt from 'bcrypt';

export class TestHelpers {
    static async createTestApp(module: any): Promise<INestApplication> {
        // Ensure database exists and migrations are applied before app initialization
        await TestDatabase.getPrismaClient();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [module],
        }).compile();

        const app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
        await app.init();

        return app;
    }

    static generateJwtToken(payload: any, jwtService?: JwtService): string {
        if (!jwtService) {
            jwtService = new JwtService({
                secret: process.env.JWT_SECRET,
            });
        }
        return jwtService.sign(payload, { expiresIn: '7d' });
    }

    static async createTestUser(data: {
        email: string;
        password: string;
    }): Promise<{ id: string; email: string; password: string }> {
        const prisma = await TestDatabase.getPrismaClient();
        const email = data.email;
        const password = data.password;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        return {
            id: user.id,
            email: user.email,
            password: password,
        };
    }

    static async createTestNotification(data: {
        userId: string;
        title: string;
        content: string;
        channel: 'email' | 'sms' | 'push_notification';
    }) {
        const prisma = await TestDatabase.getPrismaClient();

        return prisma.notifications.create({
            data: {
                title: data.title,
                content: data.content,
                channel: data.channel,
                userId: data.userId,
            },
        });
    }

    static async cleanDatabase(): Promise<void> {
        await TestDatabase.cleanDatabase();
    }
}
