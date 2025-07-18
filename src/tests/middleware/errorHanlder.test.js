import request from 'supertest';
import express from 'express';
import {errorHandler} from '../../main/middleware/errorHandler.js';
import logger from '../../main/utils/winston/logger.js';

jest.mock('../../main/utils/winston/logger.js', () => ({
    error: jest.fn(),
}));

function createApp() {
    const app = express();
    app.use((req, res, next) => {
        const error = new Error('Test error');
        error.status = 400;
        next(error);
    });
    app.use(errorHandler);
    return app;
}

describe('errorHandler middleware', () => {
    it('should handle errors and log them correctly', async () => {
        const app = createApp();

        await request(app)
            .get('/')
            .expect(400)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body.error).toBe('Test error');
            });

        expect(logger.error).toHaveBeenCalledWith(
            'Error occurred',
            expect.objectContaining({
                message: 'Test error',
                method: 'GET',
                url: '/',
                stack: expect.stringContaining('Error: Test error'),
            })
        );
    });

    it('should handle internal server error if no status is set', async () => {
        const app = express();
        app.use((req, res, next) => {
            const error = new Error('Internal Server Error');
            next(error);
        });
        app.use(errorHandler);

        await request(app)
            .get('/')
            .expect(500)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body.error).toBe('Internal Server Error');
            });

        expect(logger.error).toHaveBeenCalledWith(
            'Error occurred',
            expect.objectContaining({
                message: 'Test error',
                method: 'GET',
                url: '/',
                stack: expect.stringContaining('Error: Test error'),
            })
        );
    });
});
