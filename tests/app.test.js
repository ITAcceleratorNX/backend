import request from 'supertest';
import app from '../app';
import sequelize from "../config/database.js";

beforeAll(async () => {
    await sequelize.authenticate();
});

afterAll(async () => {
    await sequelize.close();
});

describe('Express App', () => {
    it('GET /protected без токена должен вернуть 401', async () => {
        const res = await request(app).get('/protected');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Нет токена авторизации.');
    });
})
describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
        const res = await request(app).get('/asdf');
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Не найдено');
    });
});

describe('GET /', () => {

    it('should show the home page with login link if not authenticated', async () => {
        app.use((req, res, next) => {
            req.user = null;
            next();
        });

        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('<a href="/routes/auth/google">Войти через Google</a>');
    });
});