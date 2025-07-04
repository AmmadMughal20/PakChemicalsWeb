// src/store/thunks/productThunks.ts

import axiosInstance from '@/lib/axiosInstance';
import { AppDispatch } from '../index';
import
{
    setDistributors,
    addDistributor,
    updateDistributor,
    deleteDistributor,
    setLoading,
    setError,
    Distributor,
} from '../slices/distributorsSlice';
import { User } from '@/models/User';

export const fetchDistributors = () => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        const res = await axiosInstance.get('/users');
        console.log(res.data)
        const distributors = res.data.filter((item: User) => item.role == 'distributor')
        dispatch(setDistributors(distributors));
    } catch (error: unknown)
    {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        dispatch(setError(message));
    } finally
    {
        dispatch(setLoading(false));
    }
};

export const createDistributor = (data: Omit<Distributor, '_id' | 'createdAt' | 'updatedAt'>) => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        const res = await axiosInstance.post('/users', data);
        dispatch(addDistributor(res.data));
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

export const editDistributor = (data: Distributor) => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        const res = await axiosInstance.put(`/distributors/${data._id}`, data);
        dispatch(updateDistributor(res.data));
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

export const removeDistributor = (_id: string) => async (dispatch: AppDispatch) =>
{
    dispatch(setLoading(true));
    try
    {
        await axiosInstance.delete(`/distributors/${_id}`);
        dispatch(deleteDistributor(_id));
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
