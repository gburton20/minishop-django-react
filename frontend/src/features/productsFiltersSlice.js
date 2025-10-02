import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        return await response.json();
    }
);

const initialState = {
    products: [],
    selectedCategory: 'All',
    status: 'idle',
    error: null
};

const productsFiltersSlice = createSlice({
    name: 'productsFilters',
    initialState,
    reducers: {
        setSelectedCategory(state, action) {
            state.selectedCategory = action.payload;
        },
        setProducts(state, action) {
            state.products = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { setSelectedCategory, setProducts } = productsFiltersSlice.actions;
export default productsFiltersSlice.reducer