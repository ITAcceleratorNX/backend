import dotenv from 'dotenv';
dotenv.config();

import { createSequelize } from './config/factory/sequelizeFactory.js';
import { initSequelize } from './models/index.js';
import appFactory from './config/factory/appFactory.js';

const sequelize = createSequelize({
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
});

const app = appFactory();

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к PostgreSQL установлено.');

        await initSequelize(sequelize);
        await sequelize.sync({ alter: true });
        console.log('Модели синхронизированы с БД.');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    } catch (error) {
        console.error('Ошибка при подключении:', error);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export default app;
