import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        return data.products;
    }
);

const initialState = {
    products: [],
    selectedCategory: 'All',
    searchQuery: '',
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
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        }
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

export const selectFilteredProducts = (state, allProducts) => {
  const { selectedCategory, searchQuery } = state.productsFilters;
  
  let filtered = selectedCategory === 'All' 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);
  
if (searchQuery.trim()) {
  const query = searchQuery.toLowerCase();
  filtered = filtered.filter(product => {
    const description = product.description?.toLowerCase() || '';
    const name = product.name?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';
    
    return (
      description.includes(query) ||
      name.includes(query) ||
      category.includes(query)
    );
  });
}
  
  return filtered;
};

export const { setSelectedCategory, setProducts, setSearchQuery } = productsFiltersSlice.actions;
export default productsFiltersSlice.reducer