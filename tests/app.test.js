import request from 'supertest';
import { GenericContainer } from 'testcontainers';
import { createSequelize } from '../config/factory/sequelizeFactory.js';
import appFactory from '../app.js';
import { initSequelize } from '../models/index.js';

let container;
let sequelize;
let app;

beforeAll(async () => {
    container = await new GenericContainer('postgres')
        .withEnvironment('POSTGRES_DB', 'testdb')
        .withEnvironment('POSTGRES_USER', 'testuser')
        .withEnvironment('POSTGRES_PASSWORD', 'testpass')
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
    await initSequelize(sequelize);
    app = appFactory(sequelize);
});

afterAll(async () => {
    await sequelize.close();
    await container.stop();
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
