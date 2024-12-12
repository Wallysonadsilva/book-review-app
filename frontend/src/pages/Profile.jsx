import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import ReviewCard from "../components/books/ReviewCard.jsx";

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserReviews();
    }, []);

    const fetchUserReviews = async () => {
        try {
            const response = await api.get('/reviews/user');
            setUserReviews(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await api.delete(`/reviews/${reviewId}`);
            await fetchUserReviews(); // Fetch updated reviews after deletion
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateReview = async (reviewId, updatedData) => {
        try {
            await api.put(`/reviews/${reviewId}`, updatedData);
            await fetchUserReviews(); // Fetch updated reviews after update
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
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
                {userReviews.length > 0 ? (
                    <div className="space-y-4">
                        {userReviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                onDelete={handleDeleteReview}
                                onUpdate={handleUpdateReview}
                                currentUserId={user._id}
                                showBookTitle={true}
                                isProfileView={true}
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