import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="bg-blue-500">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex space-x-4">
                        <Link to="/" className="text-white hover:text-blue-200">
                            Home
                        </Link>
                        <Link to="/books" className="text-white hover:text-blue-200">
                            Books
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        {isAuthenticated ? (
                            <>
                <span className="text-white">
                  Welcome, {user?.username}
                </span>
                                <Link
                                    to="/profile"
                                    className="text-white hover:text-blue-200"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:text-blue-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-white hover:text-blue-200">
                                    Login
                                </Link>
                                <Link to="/register" className="text-white hover:text-blue-200">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;