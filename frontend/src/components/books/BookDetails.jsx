import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getBookByISBN } from '../../services/bookService';
import api from '../../services/api';
import ReviewCard from './ReviewCard';
import ReviewForm from "../reviews/ReviewForm";

const BookDetail = () => {
    const { isbn } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { isAuthenticated, user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await getBookByISBN(isbn);
                setBook(data);
            } catch (err) {
                setError(err.message || 'Error fetching book details');
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [isbn]);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/reviews/book/${isbn}`);
            setReviews(response.data.reviews);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (isbn) {
            fetchReviews();
        }
    }, [isbn]);

    const handleUpdateReview = async (reviewId, updatedData) => {
        try {
            await api.put(`/reviews/${reviewId}`, updatedData);
            fetchReviews();
        } catch (err) {
            console.error('Error updating review:', err);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await api.delete(`/reviews/${reviewId}`);
            fetchReviews();
        } catch (err) {
            console.error('Error deleting review:', err);
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!book) return <div className="text-center">Book not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        {book.coverURL && (
                            <img
                                src={book.coverURL}
                                alt={`Cover of ${book.title}`}
                                className="w-full h-auto mb-4 rounded-md shadow-sm"
                            />
                        )}
                    </div>
                    <div>
                        <p className="text-gray-600 mb-2">
                            Author: {book.author_name?.[0] || 'Unknown'}
                        </p>
                        <p className="text-gray-600 mb-2">ISBN: {isbn}</p>
                        <p className="text-gray-600 mb-2">
                            Published: {book.first_publish_year || 'Unknown'}
                        </p>
                        {book.description?.value && (
                            <p className="text-gray-700 mt-4">{book.description.value}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {isAuthenticated && (
                    <div className="mb-8">
                        <ReviewForm
                            bookId={isbn}
                            onReviewAdded={fetchReviews}
                        />
                    </div>
                )}
                <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            onDelete={handleDeleteReview}
                            onUpdate={handleUpdateReview}
                            currentUserId={user?._id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookDetail;