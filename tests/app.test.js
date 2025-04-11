import request from 'supertest';
import appFactory from "../config/factory/appFactory.js";

let app;

beforeAll(async () => {
    app = appFactory();
})

describe('GET /', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('ExtraSpace API работает!');
    });
});

describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
        const res = await request(app).get('/asdf');
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Не найдено');
    });
});
