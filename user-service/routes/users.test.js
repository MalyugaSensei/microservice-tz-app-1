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
    await closeConnection(); // Закрываем соединение с RabbitMQ
});

describe('GET /users', () => {
    it('should return users with default limit and page', async () => {
        const response = await request(server).get('/users');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });

    it('should return users with specified limit and page', async () => {
        const response = await request(server).get('/users').query({ limit: 20, page: 2 });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });

    it('should return 400 for invalid limit', async () => {
        const response = await request(server).get('/users').query({ limit: 5 });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Invalid value');
    });

    it('should return 400 for invalid page', async () => {
        const response = await request(server).get('/users').query({ page: 0 });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Invalid value');
    });
});

describe('POST /users', () => {
    it('should create a single user', async () => {
        const user = { firstName: 'John', lastName: 'Doe', age: 30, gender: 'male' };
        const response = await request(server).post('/users').send(user);
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('ok');
    });

    it('should create multiple users', async () => {
        const users = [
            { firstName: 'John', lastName: 'Doe', age: 30, gender: 'male' },
            { firstName: 'Jane', lastName: 'Doe', age: 25, gender: 'female' }
        ];
        const response = await request(server).post('/users').send(users);
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('ok');
    });

    it('should return 400 for invalid single user data', async () => {
        const invalidUser = { firstName: '', lastName: 'Doe', age: 'thirty', gender: 'male' };
        const response = await request(server).post('/users').send(invalidUser);
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.errors); // Adjust based on the number of validation errors
    });

    it('should return 400 for invalid array user data', async () => {
        const invalidUsers = [
            { firstName: 'John', lastName: 'Doe', age: 30, gender: 'male' },
            { firstName: 'Jane', lastName: '', age: 'twenty-five', gender: 'female' }
        ];
        const response = await request(server).post('/users').send(invalidUsers);
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.errors); // Adjust based on the number of validation errors
    });
});

describe('PUT /users/:id', () => {
    it('should update a user', async () => {
        const user = { firstName: 'John', lastName: 'Doe', age: 30, gender: 'male', problems: true };
        const response = await request(server).put('/users/1').send(user);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });

    it('should return 400 for invalid single user data', async () => {
        const invalidUser = { firstName: '', lastName: 'Doe', age: 'thirty', gender: 'male', problems: 'yes' };
        const response = await request(server).put('/users/1').send(invalidUser);
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
    });
});

describe('PATCH /users/:id', () => {
    it('should partially update a user', async () => {
        const user = { firstName: 'Johnny', problems: false };
        const response = await request(server).patch('/users/1').send(user);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });

    it('should return 400 for invalid partial single user data', async () => {
        const invalidUser = { firstName: '', age: 'thirty' };
        const response = await request(server).patch('/users/1').send(invalidUser);
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
    });
});