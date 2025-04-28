import dotenv from 'dotenv';
import {sequelize} from './config/database.js';
import appFactory from './config/factory/appFactory.js';

dotenv.config();
const app = appFactory();

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к PostgreSQL установлено.');

        await sequelize.sync();
        console.log('Модели синхронизированы с БД.');

    } catch (error) {
        console.error('Ошибка при подключении:', error);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}


export default app;
