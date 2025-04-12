import * as AuthService from '../../../service/auth/AuthService.js';
import User from '../../../models/User.js';
import * as bcryptService from '../../../utils/bcrypt/BCryptService.js';
import * as jwtService from '../../../utils/jwt/JwtService.js';
import * as cryptoUtils from '../../../utils/crypto/UniqueCodeGenerator.js';
import * as sendGrid from '../../../utils/sendgird/SendGrid.js';

jest.mock('../../../models/User.js');
jest.mock('../../../utils/sendgird/SendGrid.js');
jest.mock('../../../utils/bcrypt/BCryptService.js');
jest.mock('../../../utils/jwt/JwtService.js');
jest.mock('../../../utils/crypto/UniqueCodeGenerator.js');

describe('Auth Controller', () => {
    const mockRes = () => {
        const res = {};
        res.status = jest.fn(() => res);
        res.json = jest.fn(() => res);
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
        test('should return token on successful login', async () => {
            const mockUser = { email: 'test@example.com', password_hash: 'hash', last_login: null };
            User.findOne.mockResolvedValue(mockUser);
            bcryptService.comparePassword.mockReturnValue(true);
            jwtService.generateToken.mockReturnValue('jwt-token');

            const req = { body: { email: 'test@example.com', password: 'password' } };
            const res = mockRes();

            await AuthService.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                token: 'jwt-token'
            });
        });

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
        test('should register user and return token', async () => {
            User.findOne.mockResolvedValue(null);
            cryptoUtils.verifyCode.mockReturnValue(true);
            bcryptService.getHashedPassword.mockResolvedValue('hashed');
            jwtService.generateToken.mockReturnValue('jwt-token');
            User.create.mockResolvedValue({ email: 'test@example.com' });

            const req = {
                body: {
                    email: 'test@example.com',
                    password: '123456',
                    unique_code: '123456'
                }
            };
            const res = mockRes();

            await AuthService.register(req, res);

            expect(User.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                token: 'jwt-token'
            });
        });

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
});
