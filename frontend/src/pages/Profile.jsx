import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const response = await api.get('/reviews/user'); // You'll need to add this endpoint
                setUserReviews(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserReviews();
    }, []);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            {/* User Info Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold mb-4">Profile</h1>
                <div className="mb-4">
                    <p className="text-gray-600">Username: {user.username}</p>
                    <p className="text-gray-600">Email: {user.email}</p>
                    <p className="text-gray-600">Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* User Reviews Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
                {userReviews.length > 0 ? (
                    <div className="space-y-4">
                        {userReviews.map((review) => (
                            <div key={review._id} className="border-b pb-4">
                                <h3 className="font-semibold">{review.bookId}</h3>
                                <div className="text-yellow-400">{'★'.repeat(review.rating)}</div>
                                <p className="text-gray-700">{review.comment}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
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