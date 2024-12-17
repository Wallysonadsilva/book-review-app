import api from './api';

export const searchBooks = async (query) => {
    const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
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

    const bookData = response.data;
    const authorName = bookData.by_statement || (bookData.author_name?.[0]);

    return {
        ...bookData,
        author_name: authorName,
        coverUrl: isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : null
    };
};

export const getBooksByAuthor = async (author) => {
    const response = await api.get(`/books/author/${encodeURIComponent(author)}`);

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