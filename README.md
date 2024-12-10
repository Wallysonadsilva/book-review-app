# 📚 Online Bookstore Backend

The **Online Bookstore Backend** is a RESTful server-side application designed to support an online bookstore, enabling users to explore books, manage reviews, and interact with a robust review system. This project demonstrates a comprehensive backend implementation using modern web development practices.

---

## 🌟 Purpose

This project was built to provide a backend system for an online book retailer. It allows users to interact with book data and manage reviews seamlessly. The backend serves as a RESTful web service, enabling efficient communication with a frontend client.

---

## 🚀 Features

- **📖 Book Management**:
  - Retrieve a complete list of books available in the store.
  - Search books using ISBN, author names, or titles.
- **📝 Review System**:
  - Retrieve reviews for specific books.
  - Add, update, or delete reviews (available only for logged-in users).
- **👥 User Authentication**:
  - Secure user registration and login using JWT authentication.
  - Role-based access control to ensure only authorized users can manage their reviews.
- **🔄 Multi-User Support**:
  - Enables multiple users to interact with the application simultaneously without conflicts.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **HTTP Client**: Axios
- **API Integration**: OpenLibrary API for fetching book details
- **Authentication**: JWT for secure authentication and session management
- **Frontend**: React.js (planned implementation)

---

## 🌐 API Integration

The backend integrates with the **OpenLibrary API** to fetch book information dynamically. Usage example from their Doc:
```javascript
const url = "https://openlibrary.org/search.json?q=example";
const headers = new Headers({
  "User-Agent": "BookStoreBackend/1.0 (myemail@example.com)"
});
const options = { method: 'GET', headers };

fetch(url, options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
