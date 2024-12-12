import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const formatUsername = (username) => {
      if(!username) return '';
      return username.charAt(0).toUpperCase() + username.slice(1);
    };

    return (
        <nav className="bg-sky-600">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section */}
                    <div className="flex space-x-4">
                        <Link to="/" className="text-white hover:text-blue-200">
                            Home
                        </Link>
                        <Link to="/books" className="text-white hover:text-blue-200">
                            Books
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center">
                                    <span className="text-white">Welcome,</span>
                                    <span className="text-white font-bold ml-1">
                                        {formatUsername(user?.username)}
                                    </span>
                                </div>
                                <Link
                                    to="/profile"
                                    className="text-white hover:text-blue-200"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sky-600 text-xs px-2 py-1 rounded transition"
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
