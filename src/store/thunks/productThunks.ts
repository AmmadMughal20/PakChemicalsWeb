// src/store/thunks/productThunks.ts

import axiosInstance from '@/lib/axiosInstance';
import { AppDispatch } from '../index';
import
{
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setLoading,
    setError,
    Product,
} from '../slices/productsSlice';

export const fetchProducts = () => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        const res = await axiosInstance.get('/products');
        dispatch(setProducts(res.data));
    } catch (error: unknown)
    {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        dispatch(setError(message));
    } finally
    {
        dispatch(setLoading(false));
    }
};

export const createProduct = (data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        const res = await axiosInstance.post('/products', data);
        dispatch(addProduct(res.data));
    } catch (error: unknown)
    {
        const message = error instanceof Error ? error.message : 'Failed to add product';
        dispatch(setError(message));
        throw error; // allow UI to catch and show toast
    } finally
    {
        dispatch(setLoading(false));
    }
};

export const editProduct = (data: Product) => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        const res = await axiosInstance.put(`/products/${data._id}`, data);
        dispatch(updateProduct(res.data));
    } catch (error: unknown)
    {
        const message = error instanceof Error ? error.message : 'Failed to update product';
        dispatch(setError(message));
        throw error;
    } finally
    {
        dispatch(setLoading(false));
    }
};

export const removeProduct = (id: string) => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        await axiosInstance.delete(`/products/${id}`);
        dispatch(deleteProduct(id));
    } catch (error: unknown)
    {
        const message = error instanceof Error ? error.message : 'Failed to delete product';
        dispatch(setError(message));
        throw error;
    } finally
    {
        dispatch(setLoading(false));
    }
};
