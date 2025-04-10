import request from 'supertest';
import app from '../app';
import sequelize from "../config/database.js";

beforeAll(async () => {
    await sequelize.authenticate();
});

afterAll(async () => {
    await sequelize.close();
});

describe('GET /', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('ExtraSpace API работает!');
    });

});
describe('Express App', () => {
    it('GET /protected без токена должен вернуть 401', async () => {
        const res = await request(app).get('/protected');
        expect(res.statusCode).toBe(401); // Теперь будет 401 вместо 403
        expect(res.body).toHaveProperty('error');
    });
})
describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
        const res = await request(app).get('/asdf');
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Не найдено');
    });
});