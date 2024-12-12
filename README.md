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
- **Database**: MongoDB, Mongoose
- **HTTP Client**: Axios
- **API Integration**: OpenLibrary API for fetching book details
- **Authentication**: JWT for secure authentication and session management
- **Password Hashing**: bcryptjs for secure password encryption
- **Testing**: Jest, SuperTest
- **Frontend**: React.js (Vite), Redux Toolkit, Tailwind CSS 

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
```
---

## 🚀 Clone, Install, and Run the Project
### 1. Fork and then clone
```bash
  # Clone the forked repository
  git clone https://github.com/your-username/book-review-app.git
  cd book-review-app

```
### 2. Install Dependencies
```bash
  npm install
```
### 3. Set Up Environment Variables
#### .env
```bash
# MongoDB URI for development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.noiol.mongodb.net/bookstore?retryWrites=true&w=majority

# JWT Secret key for signing tokens
JWT_SECRET_KEY=your-secret-key

# Port the server will run on
PORT=3000

# Set the Expire time for the token as you like
JWT_EXPIRES = '30d'

# Contact email to add to the OpenLibrary Header
CONTACT_EMAIL = email@example.com
```
#### .env.test
```bash
# MongoDB URI for development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.noiol.mongodb.net/bookstore_test

# JWT Secret key for signing tokens
JWT_SECRET_KEY=your-secret-key

# Set the Expire time for the token as you like
JWT_EXPIRES = '30d'

# Contact email to add to the OpenLibrary Header
CONTACT_EMAIL = email@example.com
```
### 4. Running the Application

```bash
  # backend (by default, the app will run on http://localhost:3000 )
  cd backend
  npm run dev
  
  # frontend (by default, the app will run on http://localhost:5173 )
  cd frontend
  npm run dev
```

### 5. Running Test using Jest and supertest for the API endpoint
```bash
  npm test
  
  # Optional endpoints can also be test using the api-test.http inside of the backend
  # or using Postman

  