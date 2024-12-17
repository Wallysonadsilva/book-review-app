import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { getBookByISBN } from '../../services/bookService';
import api from '../../services/api';
import ReviewCard from './ReviewCard';
import ReviewForm from "../reviews/ReviewForm";
import { setPreserveState } from '../../features/search/searchSlice';

const BookDetail = () => {
    const { isbn } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);

    // Get auth and search states from Redux
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const searchState = useSelector(state => state.search);

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

    const handleGoBack = () => {
        if (searchState.query) {
            dispatch(setPreserveState(true));
            navigate(-1);
        } else {
            navigate('/search');
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!book) return <div className="text-center">Book not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Back button */}
            <button
                onClick={handleGoBack}
                className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center transition-colors duration-200"
            >
                <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Search
            </button>

            {/* Book details card */}
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
                            Author: {book.by_statement || book.author_name || 'Unknown'}
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

            {/* Reviews section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {isAuthenticated ? (
                    <div className="mb-8">
                        <ReviewForm
                            bookId={isbn}
                            onReviewAdded={fetchReviews}
                        />
                    </div>
                ) : (
                    <p className="text-gray-600 mb-4">Please log in to leave a review.</p>
                )}
                <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                onDelete={handleDeleteReview}
                                onUpdate={handleUpdateReview}
                                currentUserId={user?._id}
                            />
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetail;