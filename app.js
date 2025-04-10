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
    res.status(200).json({ message: 'ExtraSpace API работает!' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Не найдено' });
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к PostgreSQL установлено.');
        await sequelize.sync({ alter: true });
        console.log('Модели синхронизированы с БД.');

        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Сервер запущен на порту ${PORT}`);
            });
        }
    } catch (error) {
        console.error('Ошибка при подключении к БД:', error);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
    }
};


startServer();

export default app;
