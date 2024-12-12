const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

process.env.NODE_ENV = 'test';

// Function to connect to test database
beforeAll(async () => {
    try {
        await mongoose.disconnect();
        await mongoose.connect(process.env.MONGODB_URI_TEST);
        console.log('Connected to test database');
    } catch (error) {
        console.error('Error connecting to test database:', error);
        process.exit(1);
    }
});

// Function to close database connection
afterAll(async () => {
    await mongoose.disconnect();
});

// Clear all test data after each test
afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany();
        }
    }
});

