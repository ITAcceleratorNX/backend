import jwt from 'jsonwebtoken';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import User from './models/User.js'; // Импортируем модель пользователя

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Проверка, есть ли пользователь с таким email
        let user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (!user) {
            // Если пользователя нет, создаём нового
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value
            });
        }

        // Генерация JWT токена
        const token = jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return done(null, { user, token }); // Возвращаем пользователя и токен
    } catch (err) {
        return done(err);
    }
}));


// Сериализация пользователя в сессии
passport.serializeUser((user, done) => {
    done(null, user.id); // Сохраняем id пользователя в сессии
});

// Десериализация пользователя из сессии
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id); // Загружаем пользователя по id
        done(null, user);
    } catch (err) {
        done(err);
    }
});
