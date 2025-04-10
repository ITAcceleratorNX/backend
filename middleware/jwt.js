import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Получаем токен из заголовка Authorization

    if (!token) {
        return res.status(403).json({ message: 'Нет токена авторизации.' });
    }

    // Проверяем токен
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Неверный токен.' });
        }
        req.user = user; // Добавляем пользователя в запрос
        next(); // Переходим к следующему middleware или маршруту
    });
};

export default authenticateJWT;
