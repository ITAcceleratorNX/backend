import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_SECRET_EXPIRATION || '7d';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN,}
    );
};
export const setTokenCookie = (res, token) => {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        ...(isProd && { domain: '.extraspace.kz' }),
    });
};
