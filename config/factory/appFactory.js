import express from 'express';
import session from 'express-session';
import passport from '../../config/passport.js';
import cors from 'cors';
import googleAuthRoutes from '../../auth/google.js';
import authenticateJWT from "../../middleware/jwt.js";

export default function appFactory() {
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
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
        res.status(200).json({ message: 'ExtraSpace API работает!' });
    });

    app.get('/protected', authenticateJWT, (req, res) => {
        res.json({ message: 'Этот маршрут защищён!', user: req.user });
    });

    app.use((req, res) => {
        res.status(404).json({ error: 'Не найдено' });
    });

    return app;
}
