import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.user_id, email: user.email},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN,}
    );
};
