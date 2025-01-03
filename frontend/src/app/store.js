import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import searchReducer from '../features/search/searchSlice';
import userDataReducer from '../features/userData/userDataSlice.js';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
        userData: userDataReducer
    }
});