import jwt from 'jsonwebtoken';
import {authenticateJWT, authorizeAdmin} from '../../middleware/jwt';

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
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('authorizeAdmin middleware', () => {
    it('should call next() if user is admin', () => {
        const req = { user: { role: 'Admin' } };
        const res = mockRes();
        const next = jest.fn();

        authorizeAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
        const req = { user: { role: 'User' } };
        const res = mockRes();
        const next = jest.fn();

        authorizeAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Доступ запрещён. Только для Admin.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user has no role', () => {
        const req = { user: {} };
        const res = mockRes();
        const next = jest.fn();

        authorizeAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Доступ запрещён. Только для Admin.' });
        expect(next).not.toHaveBeenCalled();
    });
});
