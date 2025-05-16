import dotenv from 'dotenv';
import {sequelize, initDb} from './config/database.js';
import appFactory from './config/factory/appFactory.js';

dotenv.config();

const app = appFactory();

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к PostgreSQL установлено.');

        await initDb();

        console.log('Миграции выполнены, сервер запускается.');

        app.listen(process.env.PORT || 8080, () => {
            console.log(`Сервер запущен на порту ${process.env.PORT || 8080}`);
        });
    } catch (error) {
        console.error('Ошибка при запуске сервера:', error);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export default app;