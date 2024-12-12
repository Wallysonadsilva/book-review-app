import api from './api';

export const searchBooks = async (query) => {
    const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
    // Transform the data to ensure cover URLs are present
    const booksWithCovers = response.data.books.map(book => ({
        ...book,
        coverUrl: book.isbn && book.isbn[0]
            ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`
            : null
    }));

    return {
        ...response.data,
        books: booksWithCovers
    };
};

export const getBookByISBN = async (isbn) => {
    const response = await api.get(`/books/isbn/${isbn}`);
    // Add cover URL to book details
    return {
        ...response.data,
        coverUrl: isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : null
    };
};

export const getBooksByAuthor = async (author) => {
    const response = await api.get(`/books/author/${encodeURIComponent(author)}`);
    // Transform the data to ensure cover URLs are present
    const booksWithCovers = response.data.books.map(book => ({
        ...book,
        coverUrl: book.isbn && book.isbn[0]
            ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`
            : null
    }));

    return {
        ...response.data,
        books: booksWithCovers
    };
};