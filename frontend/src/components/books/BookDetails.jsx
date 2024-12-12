import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBookByISBN } from '../../services/bookService';
import ReviewList from '../reviews/ReviewList';
import ReviewForm from '../reviews/ReviewForm';
import { useSelector } from 'react-redux';

const BookDetail = () => {
    const { isbn } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useSelector(state => state.auth);

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

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!book) return <div className="text-center">Book not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
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
                        {/* Book details */}
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

            {/* Reviews section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {isAuthenticated && (
                    <div className="mb-8">
                        <ReviewForm bookId={isbn} />
                    </div>
                )}
                <ReviewList bookId={isbn} />
            </div>
        </div>
    );
};

export default BookDetail;