import {
    checkEmailExists,
    checkEmailAndUniqueCode,
    checkEmailAndPassword
} from '../../middleware/AuthMiddleware.js';

describe('Middleware validation', () => {
    const mockReq = (body) => ({ body });
    const mockRes = () => {
        const res = {};
        res.status = jest.fn(() => res);
        res.json = jest.fn(() => res);
        return res;
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('checkEmailExists - should fail if email is empty', () => {
        const req = mockReq({ email: '' });
        const res = mockRes();

        checkEmailExists(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Email is required'
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('checkEmailExists - should call next if email is valid', () => {
        const req = mockReq({ email: 'test@example.com' });
        const res = mockRes();

        checkEmailExists(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test('checkEmailAndUniqueCode - missing fields', () => {
        const req = mockReq({});
        const res = mockRes();

        checkEmailAndUniqueCode(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: {
                email_error: 'Email is required',
                unique_code_error: 'Unique code is required',
                password_error: 'Password is required'
            }
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('checkEmailAndPassword - missing password', () => {
        const req = mockReq({ email: 'test@example.com' });
        const res = mockRes();

        checkEmailAndPassword(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: { password_error: 'Password is required' }
        });
    });

    test('checkEmailAndPassword - all ok', () => {
        const req = mockReq({ email: 'test@example.com', password: '123456' });
        const res = mockRes();

        checkEmailAndPassword(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
