import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        })

        super({
            adapter: new PrismaPg(pool),
            log: ['query', 'error', 'warn'],
        })
    }

    async onModuleInit() {
        try {
            await this.$connect()
        } catch (error) {
            console.error(`error connecting to database`, error)
        }
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect()
        } catch (error) {
            console.error(`error disconnecting from database`, error)
        }
    }
}
