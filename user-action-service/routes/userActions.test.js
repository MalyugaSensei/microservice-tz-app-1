const request = require('supertest');
const app = require('../app');
const { closeConnection } = require('../amqp/connect');

let server;

beforeAll((done) => {
    server = app.listen(4000, () => {
        global.agent = request.agent(server);
        done();
    });
});

afterAll(async () => {
    if (server) {
        await server.close();
    }
    await closeConnection();
});

describe('GET /:user_id', () => {
    it('should return 200 and user actions with valid parameters', async () => {
        const response = await request(server).get('/user-actions/1').query({ page: 1 });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 400 for invalid user_id parameter', async () => {
        const response = await request(server).get('/user-actions/invalid').query({ page: 1 });
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.errors[0].msg).toBe('Invalid value');
    });

    it('should return 400 for invalid page parameter', async () => {
        const response = await request(server).get('/user-actions/1').query({ page: 0 });
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.errors[0].msg).toBe('Invalid value');
    });

});