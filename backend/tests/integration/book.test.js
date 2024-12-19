const request = require('supertest');
const app = require('../../src/server');
const mongoose = require('mongoose');
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Book API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('GET /api/books/search', () => {
        it('should search for books with pagination', async () => {
            const res = await request(app)
                .get('/api/books/search')
                .query({
                    q: 'harry potter',
                    page: 1,
                    limit: 10
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('books');
            expect(res.body).toHaveProperty('page');
            expect(res.body).toHaveProperty('totalPages');

            res.body.books.forEach((book) => {
                expect(book.coverURL).toBeDefined();
                expect(book.coverURL).toMatch(/covers\.openlibrary\.org/);
            });
        });



        it('should return error for empty search query', async () => {
            const res = await request(app)
                .get('/api/books/search')
                .query({ q: '' });

            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/books/isbn/:isbn', () => {
        it('should get book by valid ISBN', async () => {
            const res = await request(app)
                .get('/api/books/isbn/0747532699');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title');
            expect(res.body).toBeDefined();
            expect(res.body.coverURL).toMatch(/covers\.openlibrary\.org/);
        });

        it('should return error for invalid ISBN', async () => {
            const res = await request(app)
                .get('/api/books/isbn/invalid-isbn');

            expect(res.status).toBe(400);
        });
    });
});
