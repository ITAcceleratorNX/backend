import jwt from 'jsonwebtoken';
import { authenticateJWT, authorizeAdmin } from '../../main/middleware/jwt.js';

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

describe('Test authenticateJWT and authorizeAdmin middlewares', () => {
    const mockRequest = (body, cookies = {}) => {
        return { body, cookies };
    };

    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };

    const next = jest.fn();

    afterEach(() => {
        jest.clearAllMocks(); // очищаем все моки после каждого теста
    });

    describe('authenticateJWT', () => {
        it('should return error if no token is provided', () => {
            const req = mockRequest({}, {});
            const res = mockResponse();

            authenticateJWT(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Нет токена авторизации.' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return error if the token is invalid', () => {
            const req = mockRequest({}, { token: 'invalid_token' });
            const res = mockResponse();
            jwt.verify.mockImplementation((token, secret, callback) => callback(new Error('Invalid token')));

            authenticateJWT(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Неверный токен.' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should add user to the request if token is valid and call next', () => {
            const req = mockRequest({}, { token: 'valid_token' });
            const res = mockResponse();
            const user = { id: 1, role: 'USER' };
            jwt.verify.mockImplementation((token, secret, callback) => callback(null, user));

            authenticateJWT(req, res, next);

            expect(req.user).toEqual(user);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('authorizeAdmin', () => {
        it('should return error if user role is not ADMIN', () => {
            const req = mockRequest({}, { user: { role: 'USER' } });
            const res = mockResponse();

            authorizeAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Доступ запрещён. Только для Admin.' });
            expect(next).not.toHaveBeenCalled();
        });

    });
});