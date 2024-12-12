const express = require("express");
const router = express.Router();
const bookService = require("../services/bookService");
const { query, param } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules
const validateBook = {
    search: [
        query('q')
            .trim()
            .notEmpty()
            .withMessage('Search query is required')
            .isLength({ min: 2 })
            .withMessage('Search query must be at least 2 characters'),
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 50 })
            .withMessage('Limit must be between 1 and 50')
    ],
    isbn: [
        param('isbn')
            .trim()
            .matches(/^[0-9X-]{10,13}$/)
            .withMessage('Invalid ISBN format')
    ],
    author: [
        param('author')
            .trim()
            .notEmpty()
            .withMessage('Author name is required')
            .isLength({ min: 2 })
            .withMessage('Author name must be at least 2 characters'),
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 50 })
            .withMessage('Limit must be between 1 and 50')
    ]
};

router.get('/search', validateBook.search, validate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 18;
        const books = await bookService.searchBooks(req.query.q, page, limit);
        res.json(books);
    } catch(err) {
        res.status(400).send({message: err.message});
    }
});

router.get('/isbn/:isbn', validateBook.isbn, validate, async (req, res) => {
    try {
        const book = await bookService.getBooksByISBN(req.params.isbn);
        res.json(book);
    } catch(err) {
        res.status(400).send({message: err.message});
    }
});

router.get('/author/:author', validateBook.author, validate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 18;
        const books = await bookService.getBookByAuthor(req.params.author, page, limit);
        res.json(books);
    } catch(err) {
        res.status(400).send({message: err.message});
    }
});

module.exports = router;
