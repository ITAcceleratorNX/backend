import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import sequelize from './config/database.js';
import './config/passport.js';
import googleAuthRoutes from './routes/auth/google.js';
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
    if (req.user) {
        res.send(`
            <h1>Главная</h1>
            <p>Привет, ${req.user.displayName}!</p>
            <a href="/routes/auth/logout">Выйти</a>
        `);
    } else {
        res.send(`
            <h1>Главная</h1>
            <a href="/routes/auth/google">Войти через Google</a>
        `);
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Этот маршрут защищён!', user: req.user });
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
    } catch (error) {
        console.error('Ошибка при подключении к БД:', error);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
    }
};
startServer();

export default app;
