import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'ExtraSpace API работает!' });
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Не найдено' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к PostgreSQL установлено.');
        await sequelize.sync({ alter: true }); // В продакшене используйте миграции вместо alter
        console.log('Модели синхронизированы с БД.');
    } catch (error) {
        console.error('Ошибка при подключении к БД:', error);
        process.exit(1);
    }
};

startServer();

export default app;
