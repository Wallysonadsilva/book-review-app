import api from './api';

export const searchBooks = async (query) => {
    const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
    return response.data;
};

export const getBookByISBN = async (isbn) => {
    const response = await api.get(`/books/isbn/${isbn}`);
    return response.data;
};

export const getBooksByAuthor = async (author) => {
    const response = await api.get(`/books/author/${encodeURIComponent(author)}`);
    return response.data;
};