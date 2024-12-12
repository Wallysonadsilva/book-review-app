import { useState } from 'react';
import api from '../../services/api';

const ReviewForm = ({ bookId, onReviewAdded }) => {
    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await api.post('/reviews', {
                bookId,
                ...formData
            });
            setFormData({ rating: 5, comment: '' });
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <select
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Comment</label>
                <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows="4"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
            >
                {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};

export default ReviewForm;