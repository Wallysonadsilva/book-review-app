
const request = require('supertest');
const app = require('../../src/server');
const mongoose = require('mongoose');
const Review = require('../../src/models/review');
const User = require('../../src/models/user');

describe('Review API', () => {
    let token;
    let userId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST);

        // Create a test user and get token
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'reviewtester',
                email: 'reviewer@test.com',
                password: 'password123'
            });

        token = response.body.token;
        userId = response.body._id;
    });

    beforeEach(async () => {
        await Review.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/reviews', () => {
        it('should create a new review', async () => {
            const review = {
                bookId: '0747532699',
                rating: 5,
                comment: 'Great book!'
            };

            const res = await request(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${token}`)
                .send(review);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('rating', 5);
            expect(res.body).toHaveProperty('comment', 'Great book!');
            expect(res.body.userId.toString()).toBe(userId);
        });

        it('should not create review without authentication', async () => {
            const review = {
                bookId: '0747532699',
                rating: 5,
                comment: 'Great book!'
            };

            const res = await request(app)
                .post('/api/reviews')
                .send(review);

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/reviews/book/:bookId', () => {
        beforeEach(async () => {
            // Create some test reviews
            await Review.create({
                bookId: '0747532699',
                userId,
                rating: 5,
                comment: 'Review 1'
            });
            await Review.create({
                bookId: '0747532699',
                userId,
                rating: 4,
                comment: 'Review 2'
            });
        });

        it('should get paginated reviews for a book', async () => {
            const res = await request(app)
                .get('/api/reviews/book/0747532699')
                .query({ page: 1, limit: 10 });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('reviews');
            expect(res.body.reviews).toHaveLength(2);
            expect(res.body).toHaveProperty('currentPage');
            expect(res.body).toHaveProperty('totalPages');
        });
    });

    describe('PUT /api/reviews/:reviewId', () => {
        let reviewId;
        let token;

        beforeEach(async () => {
            // Create a test user and get token
            const userResponse = await request(app)
                .post('/api/users/register')
                .send({
                    username: 'reviewtester',
                    email: 'reviewer@test.com',
                    password: 'password123'
                });

            token = userResponse.body.token;

            // Create a test review
            const reviewResponse = await request(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    bookId: '0747532699',
                    rating: 5,
                    comment: 'Original review'
                });

            reviewId = reviewResponse.body._id;
        });

        it('should update review by authorized user', async () => {
            const update = {
                rating: 4,
                comment: 'Updated review'
            };

            const res = await request(app)
                .put(`/api/reviews/${reviewId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(update);

            expect(res.status).toBe(200);
            expect(res.body.rating).toBe(4);
            expect(res.body.comment).toBe('Updated review');
        });
    });
});