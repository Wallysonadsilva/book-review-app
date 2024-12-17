import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        query: '',
        searchType: 'general',
        books: [],
        page: 1,
        totalPages: 0,
        loading: false,
        error: null,
        limit: 18,
        preserveState: false,
    },
    reducers: {
        setSearchState: (state, action) => {
            return { ...state, ...action.payload };
        },
        clearSearchState: (state) => {
            state.query = '';
            state.searchType = 'general';
            state.books = [];
            state.page = 1;
            state.totalPages = 0;
            state.error = null;
        },
        setPreserveState: (state, action) => {
            state.preserveState = action.payload;
        }
    }
});

export const { setSearchState, clearSearchState, setPreserveState } = searchSlice.actions;
export default searchSlice.reducer;
