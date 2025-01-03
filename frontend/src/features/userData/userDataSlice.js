import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getBookByISBN } from '../../services/bookService';

// Async thunk for fetching user reviews and book details
export const fetchUserData = createAsyncThunk(
    'userData/fetchUserData',
    async (_, { rejectWithValue }) => {
        try {
            // Fetch reviews
            const reviewsResponse = await api.get('/reviews/user');
            const reviews = reviewsResponse.data;

            // Get unique book IDs and fetch book details
            const uniqueBookIds = [...new Set(reviews.map(review => review.bookId))];
            const bookDetailsMap = {};

            // Fetch books in batches of 5
            const batchSize = 5;
            for (let i = 0; i < uniqueBookIds.length; i += batchSize) {
                const batch = uniqueBookIds.slice(i, i + batchSize);
                const batchPromises = batch.map(isbn => getBookByISBN(isbn));
                const batchResults = await Promise.all(batchPromises);

                batch.forEach((isbn, index) => {
                    bookDetailsMap[isbn] = batchResults[index];
                });
            }

            return {
                reviews,
                bookDetails: bookDetailsMap
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for updating a review
export const updateReview = createAsyncThunk(
    'userData/updateReview',
    async ({ reviewId, updatedData }, { dispatch, rejectWithValue }) => {
        try {
            await api.put(`/reviews/${reviewId}`, updatedData);
            // Refresh user data after update
            dispatch(fetchUserData());
            return reviewId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for deleting a review
export const deleteReview = createAsyncThunk(
    'userData/deleteReview',
    async (reviewId, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`/reviews/${reviewId}`);
            // Refresh user data after deletion
            dispatch(fetchUserData());
            return reviewId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
        reviews: [],
        bookDetails: {},
        loading: 'idle',
        error: null
    },
    reducers: {
        clearUserData: (state) => {
            state.reviews = [];
            state.bookDetails = {};
            state.loading = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.reviews = action.payload.reviews;
                state.bookDetails = action.payload.bookDetails;
                state.error = null;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            });
    }
});

export const { clearUserData } = userDataSlice.actions;
export default userDataSlice.reducer;