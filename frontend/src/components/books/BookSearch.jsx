import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchState, clearSearchState, setPreserveState  } from '../../features/search/searchSlice';

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
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{book.title}</h3>
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
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const searchState = useSelector((state) => state.search);

    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [searchType, setSearchType] = useState(searchParams.get('type') || 'general');
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);


    useEffect(() => {
        if (searchState.preserveState) {

            setQuery(searchState.query);
            setSearchType(searchState.searchType);
            setPage(searchState.page);


            handleSearch(null, {
                query: searchState.query,
                searchType: searchState.searchType,
                page: searchState.page
            });


            dispatch(setPreserveState(false));
        } else {
            dispatch(clearSearchState());
            setSearchParams({});
        }
    }, []);

    const updateURL = (searchData) => {
        const params = new URLSearchParams();
        if (searchData.query) params.set('q', searchData.query);
        if (searchData.searchType) params.set('type', searchData.searchType);
        if (searchData.page > 1) params.set('page', searchData.page.toString());
        setSearchParams(params);
    };

    const isISBN = (str) => {
        const isbnRegex = /^[0-9X-]{10,13}$/;
        return isbnRegex.test(str.replace(/[-\s]/g, ''));
    };

    const handleSearch = async (e, searchParams = null) => {
        if (e) e.preventDefault();

        const searchData = searchParams || {
            query,
            searchType,
            page
        };

        const cleanQuery = searchData.query.trim();

        if (!cleanQuery || cleanQuery.length < 2) {
            dispatch(setSearchState({ error: 'Search query must be at least 2 characters' }));
            return;
        }

        updateURL(searchData);

        dispatch(setSearchState({
            ...searchData,
            loading: true,
            error: null
        }));

        try {
            let url;

            switch (searchData.searchType) {
                case 'isbn':
                    if (!isISBN(cleanQuery)) {
                        dispatch(setSearchState({ error: 'Invalid ISBN format', loading: false }));
                        return;
                    }
                    url = `/api/books/isbn/${cleanQuery}`;
                    break;
                case 'author':
                    url = `/api/books/author/${encodeURIComponent(cleanQuery)}?page=${searchData.page}&limit=${searchState.limit}`;
                    break;
                default:
                    url = `/api/books/search?q=${encodeURIComponent(cleanQuery)}&page=${searchData.page}&limit=${searchState.limit}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();

            dispatch(setSearchState({
                books: searchData.searchType === 'isbn' ? [data] : (data.books || []),
                totalPages: searchData.searchType === 'isbn' ? 1 : (data.totalPages || 1),
                loading: false
            }));
        } catch (err) {
            console.error('Search error:', err);
            dispatch(setSearchState({
                error: 'Error searching books. Please try again.',
                loading: false
            }));
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        handleSearch(null, { query, searchType, page: newPage });
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
                        disabled={searchState.loading || query.trim().length < 2}
                    >
                        {searchState.loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {searchState.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {searchState.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchState.books.map((book, index) => (
                    <Link
                        to={`/books/${book.isbn?.[0] || ''}`}
                        key={book.isbn?.[0] || index}
                        className="block hover:shadow-lg transition-shadow"
                    >
                        <BookCard book={book} />
                    </Link>
                ))}
            </div>

            {searchState.totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">
                        Page {page} of {searchState.totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === searchState.totalPages}
                        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {searchState.books.length === 0 && !searchState.loading && (
                <p className="text-center text-gray-600">No books found</p>
            )}
        </div>
    );
};

export default BookSearch;