import logger from '../utils/winston/logger.js';
import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        logger.warn({
            message: 'Нет токена авторизации.',
            endpoint: req.originalUrl,
            userId: null,
            requestId: null
        });
        return res.status(401).json({ message: 'Нет токена авторизации.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.warn({
                message: 'Неверный токен.',
                endpoint: req.originalUrl,
                userId: null,
                requestId: null,
                error: err.stack
            });
            return res.status(401).json({ message: 'Неверный токен.' });
        }
        req.user = user;
        next();
    });
};
const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        logger.warn({
            message: 'Доступ запрещён. Только для Admin.',
            endpoint: req.originalUrl,
            userId: req.user ? req.user.id : null,
            requestId: req.requestId || null
        });
        return res.status(403).json({ message: 'Доступ запрещён. Только для Admin.' });
    }
    next();
};
const authorizeAdminOrManager = (req, res, next) => {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'MANAGER') {
        logger.warn({
            message: 'Доступ запрещён. Только для Admin и MANAGER.',
            endpoint: req.originalUrl,
            userId: req.user ? req.user.id : null,
            requestId: req.requestId || null
        });
        return res.status(403).json({ message: 'Доступ запрещён. Только для Admin и MANAGER.' });
    }
    next();
}

export  {authorizeAdmin, authenticateJWT, authorizeAdminOrManager}
