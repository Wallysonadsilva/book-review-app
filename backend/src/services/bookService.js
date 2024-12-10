const axios = require('axios');
require('dotenv').config();

class BookService {
    static header = {
        headers: {
            'User-Agent': `book-review-app/1.0 (${process.env.CONTACT_EMAIL})`
        }
    };

    static async searchBooks(query, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const response = await axios.get(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
                this.header
            );

            return {
                books: response.data.docs,
                total: response.data.numFound,
                page,
                totalPages: Math.ceil(response.data.numFound / limit)
            };
        } catch(err) {
            throw new Error("Error fetching books from OpenLibrary");
        }
    }

    static async getBooksByISBN(isbn) {
        try {
            const response = await axios.get(
                `https://openlibrary.org/isbn/${isbn}.json`,
                this.header
            );
            return response.data;
        } catch(err) {
            throw new Error("Error fetching books details from OpenLibrary");
        }
    }

    static async getBookByAuthor(author, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const response = await axios.get(
                `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&limit=${limit}&offset=${offset}`,
                this.header
            );

            return {
                books: response.data.docs,
                total: response.data.numFound,
                page,
                totalPages: Math.ceil(response.data.numFound / limit)
            };
        } catch(err) {
            throw new Error("Error fetching books by author from OpenLibrary");
        }
    }
}

module.exports = BookService;