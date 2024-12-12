const Review = require('../models/Review');

const reviewController = {
    // Create new review
    createReview: async (req, res) => {
        try {
            const { bookId, rating, comment } = req.body;

            const review = await Review.create({
                bookId,
                userId: req.user._id,
                rating,
                comment
            });

            res.status(201).json(review);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Get reviews for a book
    getBookReviews: async (req, res) => {
        try {
            const { bookId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const reviews = await Review.find({ bookId })
                .populate('userId', 'username')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Review.countDocuments({ bookId });

            res.json({
                reviews,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalReviews: total
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update review
    updateReview: async (req, res) => {
        try {
            const { rating, comment } = req.body;
            const review = await Review.findOne({
                _id: req.params.reviewId,
                userId: req.user._id
            });

            if (!review) {
                return res.status(404).json({ message: 'Review not found or not authorized' });
            }

            review.rating = rating || review.rating;
            review.comment = comment || review.comment;

            const updatedReview = await review.save();
            res.json(updatedReview);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete review
    deleteReview: async (req, res) => {
        try {
            const review = await Review.findOne({
                _id: req.params.reviewId,
                userId: req.user._id
            });

            if (!review) {
                return res.status(404).json({ message: 'Review not found or not authorized' });
            }

            await review.deleteOne();
            res.json({ message: 'Review removed' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Get reviews by the authenticated user
    getUserReviews: async (req, res) => {
        try {
            const userId = req.user._id;
            const reviews = await Review.find({ userId }).sort({ createdAt: -1 });
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch user reviews' });
        }
    }
};

module.exports = reviewController;