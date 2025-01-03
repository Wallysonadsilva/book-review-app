import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReviewCard from "../components/books/ReviewCard.jsx";
import { fetchUserData, updateReview, deleteReview } from '../features/userData/userDataSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { reviews, bookDetails, loading, error } = useSelector((state) => state.userData);

    // Only fetch if we don't have the data yet
    useEffect(() => {
        if (reviews.length === 0) {
            dispatch(fetchUserData());
        }
    }, [dispatch, reviews.length]);

    const handleDeleteReview = async (reviewId) => {
        try {
            await dispatch(deleteReview(reviewId));
        } catch (err) {
            console.error('Error deleting review:', err);
        }
    };

    const handleUpdateReview = async (reviewId, updatedData) => {
        try {
            await dispatch(updateReview({ reviewId, updatedData }));
        } catch (err) {
            console.error('Error updating review:', err);
        }
    };

    if (loading === 'pending') return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold mb-4">Profile</h1>
                <div className="mb-4">
                    <p className="text-gray-600">Username: {user.username}</p>
                    <p className="text-gray-600">Email: {user.email}</p>
                    <p className="text-gray-600">Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                onDelete={handleDeleteReview}
                                onUpdate={handleUpdateReview}
                                currentUserId={user._id}
                                showBookTitle={true}
                                isProfileView={true}
                                bookDetails={bookDetails[review.bookId]}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">You haven't written any reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;