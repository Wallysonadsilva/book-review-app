const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// routes
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();

const app = express();

//security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));

// access limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15min
    max: 100, // each ip to 100 requests per windowMS
});
app.use(limiter);

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({limit: '10kb'}));

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

// global error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV !== 'production' ? null : err.stack,
    })
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected successfully'))
    .catch(err => console.log(err));

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

module.exports = app;