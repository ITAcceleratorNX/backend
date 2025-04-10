import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import sequelize from './config/database.js';
import './config/passport.js'; // Настройка Passport
import googleAuthRoutes from './auth/google.js';
import authenticateJWT from "./middleware/jwt.js";
const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use('/auth', googleAuthRoutes);

app.get('/', (req, res) => {
    res.send(`
    <h1>Главная</h1>
    ${req.user ? `
      <p>Привет, ${req.user.displayName}!</p>
      <a href="/auth/logout">Выйти</a>
    ` : `
      <a href="/auth/google">Войти через Google</a>
    `}
  `);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Пример защищённого маршрута
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Этот маршрут защищён!', user: req.user });
});
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
