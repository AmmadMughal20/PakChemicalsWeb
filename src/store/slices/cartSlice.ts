
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem
{
  id: string;
  productId: string;
  name: string;
  price: string;
  quantity: number;
  unit: string;
}

interface CartState
{
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) =>
    {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem)
      {
        existingItem.quantity += action.payload.quantity;
      } else
      {
        state.items.push(action.payload);
      }
      state.total = state.items.reduce((sum, item) =>
      {
        const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
        return sum + (numericPrice * item.quantity);
      }, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) =>
    {
      const item = state.items.find(item => item.productId === action.payload.productId);
      if (item)
      {
        item.quantity = action.payload.quantity;
      }
      state.total = state.items.reduce((sum, item) =>
      {
        const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
        return sum + (numericPrice * item.quantity);
      }, 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) =>
    {
      state.items = state.items.filter(item => item.productId !== action.payload);
      state.total = state.items.reduce((sum, item) =>
      {
        const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
        return sum + (numericPrice * item.quantity);
      }, 0);
    },
    clearCart: (state) =>
    {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
