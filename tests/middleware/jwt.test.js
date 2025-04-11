import jwt from 'jsonwebtoken';
import authenticateJWT from '../../middleware/jwt';

jest.mock('jsonwebtoken');

describe('authenticateJWT Middleware', () => {

    it('should return 401 if no token is provided', () => {
        // Arrange
        const req = { header: jest.fn() };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Нет токена авторизации.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if the token is invalid', () => {
        // Arrange
        const req = { header: jest.fn().mockReturnValue('Bearer invalid_token') };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Неверный токен.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if the token is valid', () => {
        // Arrange
        const user = { id: 1, username: 'testuser' };
        const req = { header: jest.fn().mockReturnValue(`Bearer ${jwt.sign(user, process.env.JWT_SECRET)}`) };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, user);
        });

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});