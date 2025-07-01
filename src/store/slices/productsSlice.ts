// src/store/slices/productsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// MongoDB Product Interface
export interface Product
{
  _id: string;
  productCode: string;
  title_english: string;
  desc_english: string;
  category_english: string;
  price_english: string;
  unit_english: string;
  image_link: string;
  title_urdu: string;
  desc_urdu: string;
  category_urdu: string;
  price_urdu: string;
  unit_urdu: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsState
{
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) =>
    {
      state.products = action.payload;
      state.error = null;
    },
    addProduct: (state, action: PayloadAction<Product>) =>
    {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) =>
    {
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1)
      {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) =>
    {
      state.products = state.products.filter(p => p._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) =>
    {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) =>
    {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
