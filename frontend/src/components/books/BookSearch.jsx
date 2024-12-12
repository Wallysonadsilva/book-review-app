import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    const [imageError, setImageError] = useState(false);
    const coverURL = book.coverURL || null;

    return (
        <div className="bg-white rounded-lg shadow-md h-[460px] p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center mb-4">
                <div className="relative w-48 h-64">
                    {!imageError && book.coverURL ? (
                        <img
                            src={book.coverURL}
                            alt={`Cover of ${book.title}`}
                            className="absolute inset-0 w-full h-full object-contain rounded-md shadow-sm"
                            onError={() => setImageError(true)}
                            loading="lazy"
                        />
                    ) : (
                        <div className="absolute inset-0 w-full h-full bg-gray-100 rounded-md flex flex-col items-center justify-center p-4">
                            <svg
                                className="w-12 h-12 text-gray-300 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                            <span className="text-gray-400 text-center text-sm">No Cover</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                    {book.title}
                </h3>
                <p className="text-gray-600 mb-2 line-clamp-1">
                    {book.author_name?.[0] || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">
                    {book.first_publish_year || 'Year unknown'}
                </p>
                {book.isbn?.[0] && (
                    <p className="text-sm text-gray-500 truncate">
                        ISBN: {book.isbn[0]}
                    </p>
                )}
            </div>
        </div>
    );
};

const BookSearch = () => {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('general');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const LIMIT = 18;

    const isISBN = (str) => {
        const isbnRegex = /^[0-9X-]{10,13}$/;
        return isbnRegex.test(str.replace(/[-\s]/g, ''));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const cleanQuery = query.trim();

        if (!cleanQuery || cleanQuery.length < 2) {
            setError('Search query must be at least 2 characters');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let url;
            let response;

            switch (searchType) {
                case 'isbn':
                    if (!isISBN(cleanQuery)) {
                        setError('Invalid ISBN format');
                        setLoading(false);
                        return;
                    }
                    url = `/api/books/isbn/${cleanQuery}`;
                    break;
                case 'author':
                    url = `/api/books/author/${encodeURIComponent(cleanQuery)}?page=${page}&limit=${LIMIT}`;
                    break;
                default:
                    url = `/api/books/search?q=${encodeURIComponent(cleanQuery)}&page=${page}&limit=${LIMIT}`;
            }

            console.log('Fetching from URL:', url);
            response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();

            if (searchType === 'isbn') {
                setBooks(data ? [data] : []);
                setTotalPages(1);
            } else {
                setBooks(data.books || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Error searching books. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        handleSearch(new Event('submit'));
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-4">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="general">General Search</option>
                        <option value="isbn">ISBN</option>
                        <option value="author">Author</option>
                    </select>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={
                            searchType === 'isbn'
                                ? 'Enter ISBN (10 or 13 digits)...'
                                : searchType === 'author'
                                    ? 'Enter author name ...'
                                    : 'Search for books ...'
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
                        disabled={loading || query.trim().length < 2}
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
                {books.map((book, index) => (
                    <Link
                        to={`/books/${book.isbn?.[0] || ''}`}
                        key={book.isbn?.[0] || index}
                        className="block hover:shadow-lg transition-shadow"
                    >
                        <BookCard book={book}/>
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                    >
                    Previous
                    </button>
                    <span className="px-4 py-2">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {books.length === 0 && !loading && (
                <p className="text-center text-gray-600">No books found</p>
            )}
        </div>
    );
};

export default BookSearch;