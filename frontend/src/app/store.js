import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import searchReducer from '../features/search/searchSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer
    }
});