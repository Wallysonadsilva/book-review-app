import React, {useState} from "react";

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

export default BookCard;