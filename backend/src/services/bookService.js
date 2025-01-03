const axios = require('axios');
require('dotenv').config();

class BookService {
    static cache = new Map();
    static CACHE_DURATION = 1000 * 60 * 15;

    static header = {
        headers: {
            'User-Agent': `book-review-app/1.0 (${process.env.CONTACT_EMAIL})`
        }
    };

    static getCoverURL(identifier, type = 'isbn', size = 'M') {
        if (!identifier) return null;
        const cleanIdentifier = identifier.replace(/[-\s]/g, '');
        return `https://covers.openlibrary.org/b/${type}/${cleanIdentifier}-${size}.jpg`;
    }

    static getCacheKey(type, ...params) {
        return `${type}:${params.join('/')}`;
    }

    static getFromCache(cacheKey) {
        const cachedResult = this.cache.get(cacheKey);
        if(cachedResult) {
            if ( Date.now() - cachedResult.timestamp < this.CACHE_DURATION) {
                return cachedResult.data;
            }

            this.cache.delete(cacheKey);
        }
        return null;
    }

    static setCache(cacheKey, data) {
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
        });
    }

    static async searchBooks(query, page = 1, limit = 18) {
        try {
            const cacheKey = this.getCacheKey('search', query, page, limit);
            const cachedResult = this.getFromCache(cacheKey);

            if (cachedResult) {
                return cachedResult;
            }

            const offset = (page - 1) * limit;
            const response = await axios.get(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
                this.header
            );

            const { numFound = 0 } = response.data;

            const books = response.data.docs.map((book) => ({
                ...book,
                coverURL: book.isbn && book.isbn.length > 0
                    ? this.getCoverURL(book.isbn[0])
                    : null
            }));

            const result = {
                books,
                total: numFound,
                page,
                totalPages: Math.ceil(numFound / limit)
            };

            this.setCache(cacheKey, result);
            return result;
        } catch(err) {
            console.error('Error in searchBooks:', err);
            throw new Error("Error fetching books from OpenLibrary");
        }
    }

    static async getBooksByISBN(isbn) {
        try {
            const cacheKey = this.getCacheKey('isbn', isbn);
            const cachedResult = this.getFromCache(cacheKey);

            if (cachedResult) {
                return cachedResult;
            }

            const response = await axios.get(
                `https://openlibrary.org/isbn/${isbn}.json`,
                this.header
            );

            if (response.data.error) {
                return {
                    error: response.data.error,
                    status: 'error',
                };
            }

            const {
                authors = [],
                publish_date = 'unknown',
            } = response.data;

            const result = {
                title: response.data.title,
                author_name: authors?.map(author => author.name) || [],
                first_publish_year: publish_date,
                isbn: [isbn],
                coverURL: this.getCoverURL(isbn),
                ...response.data
            };

            this.setCache(cacheKey, result);
            return result;
        } catch (err) {
            console.error('Error in getBooksByISBN:', err);
            throw new Error("Error fetching book details from OpenLibrary");
        }
    }

    static async getBookByAuthor(author, page = 1, limit = 18) {
        try {
            const cacheKey = this.getCacheKey('author', author, page, limit);
            const cachedResult = this.getFromCache(cacheKey);

            if (cachedResult) {
                return cachedResult;
            }

            const offset = (page - 1) * limit;
            const response = await axios.get(
                `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&limit=${limit}&offset=${offset}`,
                this.header
            );

            const { numFound = 0 } = response.data;
            const books = response.data.docs.map(book => ({
                ...book,
                coverURL: book.isbn && book.isbn.length > 0 ? this.getCoverURL(book.isbn[0]) : null
            }));

            const result = {
                books,
                total: numFound,
                page,
                totalPages: Math.ceil(numFound / limit)
            };

            this.setCache(cacheKey, result);
            return result;
        } catch(err) {
            console.error('Error in getBookByAuthor:', err);
            throw new Error("Error fetching books by author from OpenLibrary");
        }
    }

}

module.exports = BookService;