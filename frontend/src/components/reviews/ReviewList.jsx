// src/components/reviews/ReviewList.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import ReviewItem from './ReviewItem';

const ReviewList = ({ bookId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 5;

    const fetchReviews = async (pageNum) => {
        try {
            const response = await api.get(`/reviews/book/${bookId}?page=${pageNum}&limit=${limit}`);
            setReviews(response.data.reviews);
            setTotalPages(Math.ceil(response.data.totalReviews / limit));
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(page);
    }, [bookId, page]);

    const handleUpdate = async (reviewId, updatedData) => {
        try {
            await api.put(`/reviews/${reviewId}`, updatedData);
            fetchReviews(page);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating review');
        }
    };

    const handleDelete = async (reviewId) => {
        try {
            await api.delete(`/reviews/${reviewId}`);
            fetchReviews(page);
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting review');
        }
    };

    if (loading) return <div>Loading reviews...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <div className="space-y-4 mb-6">
                {reviews.map((review) => (
                    <ReviewItem
                        key={review._id}
                        review={review}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;