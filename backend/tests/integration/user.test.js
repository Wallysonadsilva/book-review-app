const request = require('supertest');
const app = require('../../src/server');
const mongoose = require('mongoose');
const User = require('../../src/models/user');

describe('User API', () => {
    beforeAll(async () => {
        // Connect to a test database
        await mongoose.connect(process.env.MONGODB_URI_TEST);
    });

    beforeEach(async () => {
        // Clear the users collection before each test
        await User.deleteMany({});
    });

    afterAll(async () => {
        // Disconnect after all tests
        await mongoose.connection.close();
    });

    describe('POST /api/users/register', () => {
        const validUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send(validUser);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.username).toBe(validUser.username);
            expect(res.body.email).toBe(validUser.email);
            expect(res.body).not.toHaveProperty('password');
        });

        it('should not register a user with existing email', async () => {
            // First registration
            await request(app)
                .post('/api/users/register')
                .send(validUser);

            // Attempt to register with same email
            const res = await request(app)
                .post('/api/users/register')
                .send(validUser);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            // Create a user before each login test
            await request(app)
                .post('/api/users/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with wrong password', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid email or password');
        });
    });
});
