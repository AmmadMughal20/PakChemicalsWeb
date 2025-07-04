
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Distributor
{
  _id: string;
  phone: string;
  name: string;
  // businessName: string;
  address: string;
  city: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface DistributorsState
{
  distributors: Distributor[];
  loading: boolean;
  error: string | null;
}

const initialState: DistributorsState = {
  distributors: [],
  loading: false,
  error: null,
};

const distributorsSlice = createSlice({
  name: 'distributors',
  initialState,
  reducers: {
    setDistributors: (state, action: PayloadAction<Distributor[]>) =>
    {
      state.distributors = action.payload;
    },
    addDistributor: (state, action: PayloadAction<Distributor>) =>
    {
      state.distributors.push(action.payload);
    },
    updateDistributor: (state, action: PayloadAction<Distributor>) =>
    {
      const index = state.distributors.findIndex(d => d._id === action.payload._id);
      if (index !== -1)
      {
        state.distributors[index] = action.payload;
      }
    },
    deleteDistributor: (state, action: PayloadAction<string>) =>
    {
      state.distributors = state.distributors.filter(d => d._id !== action.payload);
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

export const { setDistributors, addDistributor, updateDistributor, deleteDistributor, setLoading, setError } = distributorsSlice.actions;
export default distributorsSlice.reducer;
