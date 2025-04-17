import request from 'supertest';
import express from 'express';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate.js';

const app = express();
app.use(express.json());

const schema = z.object({
    name: z.string().min(2),
    age: z.number().int().positive(),
});

app.post('/test', validateBody(schema), (req, res) => {
    res.status(200).json({ success: true, data: req.body });
});

describe('validateBody middleware', () => {
    test('✅ passes valid request', async () => {
        const response = await request(app)
            .post('/test')
            .send({ name: 'John', age: 25 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: { name: 'John', age: 25 },
        });
    });

    test('❌ fails with invalid request - missing fields', async () => {
        const response = await request(app)
            .post('/test')
            .send({ name: 'A' }); // age отсутствует, name слишком короткий

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Validation error');
        expect(response.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: 'name' }),
                expect.objectContaining({ field: 'age' }),
            ])
        );
    });

    test('❌ fails with invalid type', async () => {
        const response = await request(app)
            .post('/test')
            .send({ name: 'Anna', age: 'not-a-number' });

        expect(response.statusCode).toBe(400);
        expect(response.body.details[0].field).toBe('age');
        expect(response.body.details[0].message).toContain('number');
    });
});
