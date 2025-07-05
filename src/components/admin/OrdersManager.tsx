import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ordersAPI } from '@/services/api';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Order, updateOrderDeliveryType, updateOrderStatus } from '@/store/slices/ordersSlice';
import { fetchOrders } from '@/store/thunks/ordersThunks';
import React, { useEffect, useState } from 'react';
import OrderCard from '../OrderCard';

interface OrdersManagerProps
{
  isRTL: boolean;
}

const OrdersManager: React.FC<OrdersManagerProps> = ({ isRTL }) =>
{
  const dispatch = useAppDispatch();
  const { orders, currentPage, totalPages } = useAppSelector((state: RootState) => state.orders);
  const [limit] = useState(10); // You can allow changing this too


  const [orderTypeFilter, setOrderTypeFilter] = React.useState<'all' | 'bilti' | 'delivery'>('all');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');

  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const toggleOrder = (id: string) =>
  {
    setOpenOrderId((prev) => (prev === id ? null : id));
  };


  const handlePageChange = (newPage: number) =>
  {
    dispatch(fetchOrders({
      page: newPage,
      limit,
      orderType: orderTypeFilter !== 'all' ? orderTypeFilter : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }));
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) =>
  {
    try
    {
      await ordersAPI.updateStatus(orderId, newStatus);
      dispatch(updateOrderStatus({ orderId, status: newStatus }));
      toast({
        title: isRTL ? 'کامیابی' : 'Success',
        description: isRTL ? 'آرڈر کی حالت تبدیل ہو گئی' : 'Order status updated successfully',
      });
    } catch (error)
    {
      console.log(error)
      toast({
        title: isRTL ? 'خرابی' : 'Error',
        description: isRTL ? 'آرڈر کی حالت تبدیل کرنے میں خرابی' : 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const handleDeliveryTypeChange = async (orderId: string, newType: 'bilti' | 'delivery') =>
  {
    try
    {
      await ordersAPI.updateDeliveryType(orderId, newType);
      dispatch(updateOrderDeliveryType({ orderId, orderType: newType }));
      toast({
        title: isRTL ? 'کامیابی' : 'Success',
        description: isRTL ? 'ڈیلیوری ٹائپ تبدیل ہو گئی' : 'Delivery type updated',
      });
    } catch (error)
    {
      console.log(error)
      toast({
        title: isRTL ? 'خرابی' : 'Error',
        description: isRTL ? 'ڈیلیوری ٹائپ تبدیل نہیں ہو سکی' : 'Failed to change delivery type',
        variant: 'destructive',
      });
    }
  };

  function formatPrice(value: number | string): string
  {
    const number = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;

    if (isNaN(number)) return '0';

    return number.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  useEffect(() =>
  {
    dispatch(fetchOrders())
  }, [dispatch])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        {/* Heading */}
        <h2 className="text-xl font-bold text-blue-700/90 tracking-tight whitespace-nowrap">
          {isRTL ? 'آرڈرز کا انتظام' : 'Orders Management'}
        </h2>

        <div className='flex flex-row gap-5 items-end'>
          {/* Order Type Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              {isRTL ? 'ٹائپ فلٹر' : 'Order Type'}
            </label>
            <Select value={orderTypeFilter} onValueChange={(value) => setOrderTypeFilter(value as 'all' | 'bilti' | 'delivery')}>
              <SelectTrigger className="w-[120px] h-9 bg-gray-100">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'سب' : 'All'}</SelectItem>
                <SelectItem value="bilti">{isRTL ? 'بلٹی' : 'Bilti'}</SelectItem>
                <SelectItem value="delivery">{isRTL ? 'ڈیلیوری' : 'Delivery'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              {isRTL ? 'تاریخ سے' : 'Date From'}
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[130px] h-9 border border-gray-300 rounded px-2 text-sm"
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              {isRTL ? 'تاریخ تک' : 'Date To'}
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[130px] h-9 border border-gray-300 rounded px-2 text-sm"
            />
          </div>

          {/* Apply Filter Button */}
          <button
            onClick={() =>
            {
              dispatch(fetchOrders({
                orderType: orderTypeFilter !== 'all' ? orderTypeFilter : undefined,
                dateFrom: dateFrom || undefined,
                dateTo: dateTo || undefined,
              }));
            }}
            className="h-9 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isRTL ? 'فلٹر کریں' : 'Apply'}
          </button>
        </div>


        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="h-9 px-2 text-sm border rounded disabled:opacity-50"
          >
            {isRTL ? 'پچھلا' : 'Prev'}
          </button>
          <span className="text-sm">
            {isRTL ? `صفحہ ${currentPage}` : `Page ${currentPage} of ${totalPages}`}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="h-9 px-2 text-sm border rounded disabled:opacity-50"
          >
            {isRTL ? 'اگلا' : 'Next'}
          </button>
        </div>
      </div>



      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            isRTL={isRTL}
            isOpen={openOrderId === order._id}
            onToggle={() => toggleOrder(order._id)}
            handleStatusChange={handleStatusChange}
            handleDeliveryTypeChange={handleDeliveryTypeChange}
            formatPrice={formatPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default OrdersManager;
