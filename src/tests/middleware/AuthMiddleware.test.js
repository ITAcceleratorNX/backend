import {checkEmailAndPassword, checkEmailAndUniqueCode, checkEmailExists} from "../../main/middleware/AuthMiddleware.js";
describe('Middleware tests', () => {

    const mockRequest = (body) => {
        return { body };
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

    it('should return error if email is empty in checkEmailExists', () => {
        const req = mockRequest({ email: '' });
        const res = mockResponse();

        checkEmailExists(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Email is required' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if email is provided in checkEmailExists', () => {
        const req = mockRequest({ email: 'test@example.com' });
        const res = mockResponse();

        checkEmailExists(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return error if any field is empty in checkEmailAndUniqueCode', () => {
        const req = mockRequest({ email: '', unique_code: '', password: '' });
        const res = mockResponse();

        checkEmailAndUniqueCode(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: {
                email_error: 'Email is required',
                unique_code_error: 'Unique code is required',
                password_error: 'Password is required',
            },
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if all fields are provided in checkEmailAndUniqueCode', () => {
        const req = mockRequest({
            email: 'test@example.com',
            unique_code: '12345',
            password: 'password123',
        });
        const res = mockResponse();

        checkEmailAndUniqueCode(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return error if email or password is empty in checkEmailAndPassword', () => {
        const req = mockRequest({ email: '', password: '' });
        const res = mockResponse();

        checkEmailAndPassword(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: {
                email_error: 'Email is required',
                password_error: 'Password is required',
            },
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if email and password are provided in checkEmailAndPassword', () => {
        const req = mockRequest({ email: 'test@example.com', password: 'password123' });
        const res = mockResponse();

        checkEmailAndPassword(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
