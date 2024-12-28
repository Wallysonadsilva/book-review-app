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

    static getCacheKey(query, page, limit){
        return `${query}/${page}/${limit}`;
    }

    static async searchBooks(query, page = 1, limit = 18) {
        try {
            const cacheKey = this.getCacheKey(query, page, limit);

            const cachedResult = this.cache.get(cacheKey);

            if (cachedResult && Date.now() - cachedResult.timestamp < this.CACHE_DURATION) {
                return cachedResult.data;
            }

            const offset = (page - 1) * limit;
            const response = await axios.get(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
                this.header
            );

            const { numFound = 0 } = response.data;

            const books = response.data.docs.map((book) => {
                return {
                    ...book,
                    coverURL: book.isbn && book.isbn.length > 0
                        ? this.getCoverURL(book.isbn[0])
                        : null
                };
            });

            const result = {
                books,
                total: numFound,
                page,
                totalPages: Math.ceil(numFound / limit)
            };

            // save the search result in cache
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now(),
            });
            return result;
        } catch(err) {
            console.error('Error in searchBooks:', err);
            throw new Error("Error fetching books from OpenLibrary");
        }
    }

    static async getBooksByISBN(isbn) {
        try {
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

            return {
                title: response.data.title,
                author_name: authors?.map(author => author.name) || [],
                first_publish_year: publish_date,
                isbn: [isbn],
                coverURL: this.getCoverURL(isbn),
                ...response.data
            };
        } catch (err) {
            console.error('Error in getBooksByISBN:', err);
            throw new Error("Error fetching book details from OpenLibrary");
        }
    }

    static async getBookByAuthor(author, page = 1, limit = 18) {
        try {
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

            return {
                books,
                total: numFound,
                page,
                totalPages: Math.ceil(numFound / limit)
            };
        } catch(err) {
            console.error('Error in getBookByAuthor:', err);
            throw new Error("Error fetching books by author from OpenLibrary");
        }
    }

    static clearCache(){
        this.cache.clear();
    }

    static clearSearchCache(query, page = 1, limit = 18) {
        const cacheKey = this.getCacheKey(query, page, limit);
        const deleted = this.cache.delete(cacheKey);
    }

    static cleanExpiredCache(){
        const now = Date.now()
        let cleared = 0;
        for (const [key, value] of this.cache.entries()) {
            if(now - value.timestamp < this.CACHE_DURATION) {
                this.cache.delete(key);
                cleared++;
            }
        }
    }
}

module.exports = BookService;