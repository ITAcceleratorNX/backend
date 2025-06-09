import dotenv from 'dotenv';
import pg from 'pg';
import migrate from 'node-pg-migrate';
import { createSequelize } from './sequelize.js';
import logger from "../utils/winston/logger.js";

dotenv.config();

export const sequelize = createSequelize({
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
});

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export async function initDb() {
    try {
        logger.info('Migration is running...');

        await migrate({
            databaseUrl: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            },
            migrationsTable: 'schema_migrations',
            dir: 'src/main/migrations',
            direction: 'up',
            log: () => {},
            verbose: true,
            sqlFile: true,
        });

        logger.info('Migrations successfully.');
    } catch (error) {
        logger.error('Migration error:', error);
        process.exit(1);
    }
}

export default { pool, sequelize };