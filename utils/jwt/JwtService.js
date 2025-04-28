import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.user_id, email: user.email, role: user.role },
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN,}
    );
};
export const setTokenCookie=(res, token) =>{
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ставить secure=true в продакшене
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
    });
}
