import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User
{
  id: string;
  phone: string;
  name: string;
  role: 'admin' | 'distributor';
  businessName?: string;
  address?: string;
  city?: string;
}

interface AuthState
{
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) =>
    {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) =>
    {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state) =>
    {
      state.loading = false;
    },
    logout: (state) =>
    {
      localStorage.removeItem('token')
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
