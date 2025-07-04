
import { CartItem, CustomerInfo } from '@/models/Order';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order
{

  _id: string,
  createdAt: string,
  customer: CustomerInfo,
  items: CartItem[]
  orderType: 'bilti' | 'delivery'; // New field
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string,
  total: number,
  updatedAt: string;
  _v: string;
}

interface OrdersState
{
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) =>
    {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) =>
    {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) =>
    {
      const order = state.orders.find(o => o._id === action.payload.orderId);
      if (order)
      {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }
    },
    updateOrderDeliveryType: (state, action: PayloadAction<{ orderId: string; orderType: 'bilti' | 'delivery' }>) =>
    {
      const order = state.orders.find(o => o._id === action.payload.orderId);
      if (order)
      {
        order.orderType = action.payload.orderType;
        order.updatedAt = new Date().toISOString();
      }
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

export const { setOrders, addOrder, updateOrderStatus, updateOrderDeliveryType, setLoading, setError } = ordersSlice.actions;
export default ordersSlice.reducer;
