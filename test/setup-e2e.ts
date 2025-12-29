import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Set test environment
process.env.NODE_ENV = 'test';

// Load .env.test file into process.env
dotenv.config({ path: resolve(__dirname, '../.env.test') });

// Fallback values if .env.test is missing or incomplete
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/take_home_challenge_test?schema=public';
}

if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'test-secret-key-for-integration-tests';
}
