import { useState } from 'react';

const ReviewCard = ({
                        review,
                        onDelete,
                        onUpdate,
                        currentUserId,
                        showBookTitle = false,
                        isProfileView = false,
                        bookDetails = null
                    }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedReview, setEditedReview] = useState({
        rating: review.rating,
        comment: review.comment
    });

    const handleUpdate = () => {
        onUpdate(review._id, editedReview);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            onDelete(review._id);
        }
    };

    const isUserReview = isProfileView || currentUserId === (review.userId._id || review.userId);

    if (isEditing) {
        return (
            <div className="border-b pb-4">
                {showBookTitle && bookDetails && (
                    <div className="flex items-start gap-4 mb-4">
                        {bookDetails.coverURL && (
                            <img
                                src={bookDetails.coverURL}
                                alt={`Cover of ${bookDetails.title}`}
                                className="w-20 h-auto rounded shadow-sm"
                            />
                        )}
                        <div>
                            <p className="font-semibold text-gray-700">{bookDetails.title}</p>
                            <p className="text-sm text-gray-600">ISBN: {review.bookId}</p>
                            {bookDetails.author_name && (
                                <p className="text-sm text-gray-600">
                                    Author: {bookDetails.author_name[0]}
                                </p>
                            )}
                        </div>
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Rating</label>
                    <select
                        value={editedReview.rating}
                        onChange={(e) => setEditedReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
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
                        value={editedReview.comment}
                        onChange={(e) => setEditedReview(prev => ({ ...prev, comment: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        rows="3"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="border-b pb-4">
            {showBookTitle && bookDetails && (
                <div className="flex items-start gap-4 mb-4">
                    {bookDetails.coverURL && (
                        <img
                            src={bookDetails.coverURL}
                            alt={`Cover of ${bookDetails.title}`}
                            className="w-20 h-auto rounded shadow-sm"
                        />
                    )}
                    <div>
                        <p className="font-semibold text-gray-700">{bookDetails.title}</p>
                        <p className="text-sm text-gray-600">ISBN: {review.bookId}</p>
                        {bookDetails.author_name && (
                            <p className="text-sm text-gray-600">
                                Author: {bookDetails.author_name[0]}
                            </p>
                        )}
                    </div>
                </div>
            )}
            {!isProfileView && review.userId && (
                <p className="font-semibold text-gray-800">{review.userId.username}</p>
            )}
            <div className="flex items-center gap-1 text-yellow-400 my-1">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
            </div>
            <p className="text-gray-700 mt-2">{review.comment}</p>
            <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                </p>
                {isUserReview && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;