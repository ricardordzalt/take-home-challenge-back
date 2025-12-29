import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export class TestDatabase {
    private static dbExistsChecked = false;
    private static prisma: PrismaClient;
    private static pool: Pool;

    private static async ensureDatabaseExists(): Promise<void> {
        if (this.dbExistsChecked) return;

        const url = new URL(process.env.DATABASE_URL!);
        const targetDb = url.pathname.slice(1);

        // Connect to 'postgres' default database to check/create the target database
        url.pathname = '/postgres';
        const maintenancePool = new Pool({
            connectionString: url.toString(),
        });

        try {
            console.log(`Ensuring database "${targetDb}" exists...`);
            const result = await maintenancePool.query(
                `SELECT 1 FROM pg_database WHERE datname = $1`,
                [targetDb]
            );

            if (result.rowCount === 0) {
                console.log(`Creating database "${targetDb}"...`);
                try {
                    await maintenancePool.query(`CREATE DATABASE "${targetDb}"`);
                } catch (e) {
                    if (e.code !== '42P04') throw e; // 42P04 is duplicate_database
                }
            }

            console.log(`Applying migrations to "${targetDb}"...`);
            execSync('npx prisma migrate deploy', {
                env: { ...process.env },
                stdio: 'pipe', // Hide output unless error
            });
            console.log(`Migrations applied successfully.`);

            this.dbExistsChecked = true;
        } catch (error) {
            console.error('Error ensuring database exists:', error);
            throw error;
        } finally {
            await maintenancePool.end();
        }
    }

    static async getPrismaClient(): Promise<PrismaClient> {
        if (!this.prisma) {
            await this.ensureDatabaseExists();

            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
            });

            this.prisma = new PrismaClient({
                adapter: new PrismaPg(this.pool),
            });
        }
        return this.prisma;
    }

    static async cleanDatabase(): Promise<void> {
        const prisma = await this.getPrismaClient();

        // Delete in order due to foreign key constraints
        await prisma.notifications.deleteMany({});
        await prisma.users.deleteMany({});
    }

    static async disconnect(): Promise<void> {
        if (this.prisma) {
            await this.prisma.$disconnect();
            (this as any).prisma = undefined;
        }
        if (this.pool) {
            await this.pool.end();
            (this as any).pool = undefined;
        }
    }
}
