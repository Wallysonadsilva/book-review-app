import { useState } from 'react';
import { searchBooks } from '../../services/bookService';
import { Link } from 'react-router-dom';

const BookSearch = () => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const data = await searchBooks(query);
            setBooks(data.books || []);
        } catch (err) {
            setError(err.message || 'Error searching books');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for books..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <Link
                        to={`/books/${book.isbn?.[0] || ''}`}
                        key={book.key}
                        className="block hover:shadow-lg transition-shadow"
                    >
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                            <p className="text-gray-600 mb-2">
                                Author: {book.author_name?.[0] || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-500">
                                First published: {book.first_publish_year || 'Unknown'}
                            </p>
                            {book.isbn?.[0] && (
                                <p className="text-sm text-gray-500">
                                    ISBN: {book.isbn[0]}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {books.length === 0 && !loading && (
                <p className="text-center text-gray-600">No books found</p>
            )}
        </div>
    );
};

export default BookSearch;