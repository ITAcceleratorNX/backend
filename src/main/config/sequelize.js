import { Sequelize } from 'sequelize';
import dotenv from "dotenv";

dotenv.config();

export function createSequelize({ dbName, user, password, host, port }) {
    return new Sequelize(dbName, user, password, {
        host,
        port,
        dialect: 'postgres',
        timezone: '+00:00',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: false,
            freezeTableName: true
        },
        logging: true,
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        }
    });
}
