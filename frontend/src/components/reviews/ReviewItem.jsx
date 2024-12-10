import { useState } from 'react';
import { useSelector } from 'react-redux';

const ReviewItem = ({ review, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedReview, setEditedReview] = useState({
        rating: review.rating,
        comment: review.comment
    });
    const { user } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onUpdate(review._id, editedReview);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Rating</label>
                    <select
                        value={editedReview.rating}
                        onChange={(e) => setEditedReview({...editedReview, rating: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        {[5, 4, 3, 2, 1].map(num => (
                            <option key={num} value={num}>{num} Stars</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Comment</label>
                    <textarea
                        value={editedReview.comment}
                        onChange={(e) => setEditedReview({...editedReview, comment: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        rows="4"
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center mb-2">
                        <div className="text-yellow-400">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                        </div>
                        <span className="ml-2 text-gray-600">
              by {review.userId.username}
            </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                </div>
                {user && user._id === review.userId._id && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(review._id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewItem;