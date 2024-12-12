const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');
const { body, query } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules
const validateReview = {
    create: [
        body('bookId').notEmpty().withMessage('Book ID is required'),
        body('rating')
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be between 1 and 5'),
        body('comment')
            .trim()
            .isLength({ min: 1, max: 500 })
            .withMessage('Comment must be between 1 and 500 characters')
    ],
    update: [
        body('rating')
            .optional()
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be between 1 and 5'),
        body('comment')
            .optional()
            .trim()
            .isLength({ min: 1, max: 500 })
            .withMessage('Comment must be between 1 and 500 characters')
    ],
    pagination: [
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

router.post('/', authenticateJWT, validateReview.create, validate, reviewController.createReview);
router.get('/book/:bookId', validateReview.pagination, validate, reviewController.getBookReviews);
router.put('/:reviewId', authenticateJWT, validateReview.update, validate, reviewController.updateReview);
router.delete('/:reviewId', authenticateJWT, reviewController.deleteReview);
router.get('/user', authenticateJWT, reviewController.getUserReviews);

module.exports = router;