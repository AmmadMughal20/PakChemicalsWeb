// src/store/thunks/productsThunks.ts

import { AppDispatch } from '../index';
import
{
    setProducts,
    setLoading,
    setError,
} from '../slices/productsSlice';

export const fetchProducts = () => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');

        const data = await res.json();
        dispatch(setProducts(data));
    } catch (error: any)
    {
        dispatch(setError(error.message || 'Something went wrong'));
    } finally
    {
        dispatch(setLoading(false));
    }
};
