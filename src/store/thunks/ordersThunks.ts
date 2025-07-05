// src/store/thunks/productThunks.ts

import axiosInstance from '@/lib/axiosInstance';
import { AppDispatch } from '../index';
import
{
    setOrders,
    addOrder,
    setTotalPages,
    setCurrentPage,
    // updateOrder,
    // deleteOrder,
    setLoading,
    setError,
    Order,
} from '../slices/ordersSlice';

interface OrderFilters
{
    page?: number;
    limit?: number;
    dateFrom?: string;     // 'YYYY-MM-DD'
    dateTo?: string;       // 'YYYY-MM-DD'
    orderType?: 'delivery' | 'bilti';
}


export const fetchOrders = (filters: OrderFilters = {}) => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        const params = new URLSearchParams();

        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.orderType) params.append('orderType', filters.orderType);

        const res = await axiosInstance.get(`/orders?${params.toString()}`);
        dispatch(setOrders(res.data.orders));
        dispatch(setTotalPages(res.data.pages)); // <-- NEW
        dispatch(setCurrentPage(res.data.page)); // <-- NEW
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
