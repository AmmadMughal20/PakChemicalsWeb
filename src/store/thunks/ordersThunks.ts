// src/store/thunks/productThunks.ts

import axiosInstance from '@/lib/axiosInstance';
import { AppDispatch } from '../index';
import
{
    setOrders,
    addOrder,
    // updateOrder,
    // deleteOrder,
    setLoading,
    setError,
    Order,
} from '../slices/ordersSlice';

export const fetchOrders = () => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        const res = await axiosInstance.get('/orders');
        dispatch(setOrders(res.data.orders));
    } catch (error: unknown)
    {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        dispatch(setError(message));
    } finally
    {
        dispatch(setLoading(false));
    }
};

export const createOrder = (data: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>) => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        const res = await axiosInstance.post('/users', data);
        dispatch(addOrder(res.data));
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

// export const editOrder = (data: Order) => async (dispatch: AppDispatch) =>
// {
//     dispatch(setLoading(true));
//     try
//     {
//         const res = await axiosInstance.put(`/orders/${data._id}`, data);
//         dispatch(updateOrder(res.data));
//     } catch (error: unknown)
//     {
//         const message = error instanceof Error ? error.message : 'Failed to update product';
//         dispatch(setError(message));
//         throw error;
//     } finally
//     {
//         dispatch(setLoading(false));
//     }
// };

// export const removeOrder = (_id: string) => async (dispatch: AppDispatch) =>
// {
//     dispatch(setLoading(true));
//     try
//     {
//         await axiosInstance.delete(`/orders/${_id}`);
//         dispatch(deleteOrder(_id));
//     } catch (error: unknown)
//     {
//         const message = error instanceof Error ? error.message : 'Failed to delete product';
//         dispatch(setError(message));
//         throw error;
//     } finally
//     {
//         dispatch(setLoading(false));
//     }
// };
