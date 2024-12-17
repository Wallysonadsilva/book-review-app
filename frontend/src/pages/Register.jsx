// src/pages/Register.jsx
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let redirectTimer;
        if(success){
            redirectTimer = setTimeout(() => {
                navigate('/login');
            }, 3000);
        }

        // clean timer when component is unmount or success state changes
        return () => {
          if(redirectTimer){
              clearTimeout(redirectTimer);
          }
        };
    },[success,navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/register', formData);
/*            localStorage.setItem('token', response.data.token);
            navigate('/');*/
            setSuccess(true);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setSuccess(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-6">Register</h2>
            { success ? (
                <div className="mb-4 bg-green-100 border-green-400 text-green-700">
                    <span>
                        Registration successful! You will be redirected to the login page in 3 seconds...
                    </span>
                </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none"
                >
                    Register
                </button>
            </form>
                )}
        </div>
    );
};

export default Register;