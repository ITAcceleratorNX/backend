import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

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
const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Доступ запрещён. Только для Admin.' });
    }
    next();
};
const authorizeAdminOrManager = (req, res, next) => {
    if (req.user?.role !== 'ADMIN' || req.user?.role === 'MANAGER') {
        return res.status(403).json({ message: 'Доступ запрещён. Только для Admin и MANAGER.' });
    }
    next();
}

export  {authorizeAdmin, authenticateJWT, authorizeAdminOrManager}
