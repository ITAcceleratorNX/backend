import * as AuthService from '../../../main/service/auth/AuthService.js';
import {User} from '../../../main/models/init/index.js';
import * as bcryptService from '../../../main/utils/bcrypt/BCryptService.js';
import * as cryptoUtils from '../../../main/utils/crypto/UniqueCodeGenerator.js';
import * as sendGrid from '../../../main/utils/sendgird/SendGrid.js';

jest.mock('../../../main/models/init/index.js');
jest.mock('../../../main/utils/sendgird/SendGrid.js');
jest.mock('../../../main/utils/bcrypt/BCryptService.js');
jest.mock('../../../main/utils/jwt/JwtService.js');
jest.mock('../../../main/utils/crypto/UniqueCodeGenerator.js');

describe('Auth Controller', () => {
    const mockRes = () => {
        const res = {};
        res.status = jest.fn(() => res);
        res.json = jest.fn(() => res);
        res.cookie = jest.fn(() => res); // <-- добавил мок для cookie
        return res;
    };


    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkEmail', () => {
        test('should send unique code if user not exists', async () => {
            User.findOne.mockResolvedValue(null);
            cryptoUtils.generateSecureCode.mockReturnValue('123456');

            const req = { body: { email: 'test@example.com' } };
            const res = mockRes();

            await AuthService.checkEmail(req, res);

            expect(sendGrid.sendVerificationCode).toHaveBeenCalledWith('test@example.com', '123456');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                user_exists: false,
                email: 'test@example.com'
            });
        });

        test('should return user_exists = true if user exists', async () => {
            User.findOne.mockResolvedValue({ _id: '123' });

            const req = { body: { email: 'existing@example.com' } };
            const res = mockRes();

            await AuthService.checkEmail(req, res);

            expect(res.json).toHaveBeenCalledWith({ user_exists: true });
        });
    });

    describe('login', () => {

        test('should return error for invalid password', async () => {
            User.findOne.mockResolvedValue({ password_hash: 'hash' });
            bcryptService.comparePassword.mockReturnValue(false);

            const req = { body: { email: 'test@example.com', password: 'wrong' } };
            const res = mockRes();

            await AuthService.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid password'
            });
        });
    });

    describe('register', () => {


        test('should return validation errors for invalid input', async () => {
            User.findOne.mockResolvedValue(null);
            cryptoUtils.verifyCode.mockReturnValue(false);

            const req = {
                body: {
                    email: 'invalid',
                    password: '123',
                    unique_code: 'wrong'
                }
            };
            const res = mockRes();

            await AuthService.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: expect.objectContaining({
                    email_error: expect.any(String),
                    password_error: expect.any(String),
                    unique_code_error: expect.any(String)
                })
            });
        });
    });

    describe('restorePassword', () => {

        test('should return 400 if user not found', async () => {
            User.findOne.mockResolvedValue(null);

            const req = {
                body: {
                    email: 'notfound@example.com',
                    password: '123456',
                    unique_code: 'code'
                }
            };
            const res = mockRes();

            await AuthService.restorePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'User not found'
            });
        });

        test('should return validation errors', async () => {
            const mockUser = {
                email: 'test@example.com',
                save: jest.fn(),
            };
            User.findOne.mockResolvedValue(mockUser);
            cryptoUtils.verifyCode.mockReturnValue(false); // invalid code

            const req = {
                body: {
                    email: 'invalid',
                    password: '123',
                    unique_code: 'wrong'
                }
            };
            const res = mockRes();

            await AuthService.restorePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: expect.objectContaining({
                    email_error: expect.any(String),
                    password_error: expect.any(String),
                    unique_code_error: expect.any(String)
                })
            });
        });
    });
});
