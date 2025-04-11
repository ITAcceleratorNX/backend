import request from 'supertest';
import {GenericContainer} from 'testcontainers';
import {createSequelize} from '../config/factory/sequelizeFactory.js';
import appFactory from '../config/factory/appFactory.js';

let sequelize;
let app;

beforeAll(async () => {
    const container = await new GenericContainer('postgres')
        .withEnvironment({
            POSTGRES_DB: 'testdb',
            POSTGRES_USER: 'testuser',
            POSTGRES_PASSWORD: 'testpass',
        })
        .withExposedPorts(5432)
        .start();
    const dbConfig = {
        dbName: 'testdb',
        user: 'testuser',
        password: 'testpass',
        host: container.getHost(),
        port: container.getMappedPort(5432)
    };

    sequelize = createSequelize(dbConfig);
    await sequelize.authenticate();
    await sequelize.sync({alter: true});
    app = appFactory();
});

afterAll(async () => {
    await sequelize.close();
    await sequelize.close();
});

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
