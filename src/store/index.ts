import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, persistStore } from 'redux-persist';
import authSlice from './slices/authSlice';
import productsSlice from './slices/productsSlice';
import distributorsSlice from './slices/distributorsSlice';
import ordersSlice from './slices/ordersSlice';
import cartSlice from './slices/cartSlice';

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  products: productsSlice,
  distributors: distributorsSlice,
  orders: ordersSlice,
  cart: cartSlice,
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'], // choose what to persist
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
