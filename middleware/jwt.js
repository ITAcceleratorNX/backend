// 📁 jwt.js (біріктірілген)
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

// 🔐 Access token генерациялау
export function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role_code },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// 🔄 Refresh token генерациялау
export function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.user_id }, // ✅ user_id болуы керек
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}


// ✅ Access token тексеру
export function verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

// ✅ Refresh token тексеру
export function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
}

// 🔒 JWT аутентификация Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Нет токена авторизации.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Неверный токен.' });
        }
        req.user = user;
        next();
    });
};

export default authenticateJWT;