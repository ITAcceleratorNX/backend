import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Нет токена авторизации.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Неверный токен.' });
        }
        req.user = user;
        next();
    });
};

export default authenticateJWT;
