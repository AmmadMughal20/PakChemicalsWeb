
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
  totalPages: number;
  currentPage: number;
  filters: {
    dateFrom?: string;
    dateTo?: string;
    orderType?: 'bilti' | 'delivery';
  }
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  filters: {},
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) =>
    {
      state.orders = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) =>
    {
      state.totalPages = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) =>
    {
      state.currentPage = action.payload;
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
    setFilters: (state, action: PayloadAction<OrdersState['filters']>) =>
    {
      state.filters = action.payload;
    },
  },
});

export const { setOrders, addOrder, updateOrderStatus, updateOrderDeliveryType, setLoading, setError, setFilters, setTotalPages, setCurrentPage, } = ordersSlice.actions;
export default ordersSlice.reducer;
