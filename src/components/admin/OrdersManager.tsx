import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ordersAPI } from '@/services/api';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Order, updateOrderDeliveryType, updateOrderStatus } from '@/store/slices/ordersSlice';
import { fetchOrders } from '@/store/thunks/ordersThunks';
import Image from 'next/image';
import React, { useEffect } from 'react';

interface OrdersManagerProps
{
  isRTL: boolean;
}

const OrdersManager: React.FC<OrdersManagerProps> = ({ isRTL }) =>
{
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state: RootState) => state.orders);

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

  const getStatusBadgeVariant = (status: Order['status']) =>
  {
    switch (status)
    {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'shipped': return 'outline';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: Order['status']) =>
  {
    if (isRTL)
    {
      switch (status)
      {
        case 'pending': return 'زیر التواء';
        case 'confirmed': return 'تصدیق شدہ';
        case 'shipped': return 'روانہ';
        case 'delivered': return 'پہنچا دیا گیا';
        case 'cancelled': return 'منسوخ';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
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
      <h2 className="text-xl font-bold text-blue-700/90 tracking-tight">
        {isRTL ? 'آرڈرز کا انتظام' : 'Orders Management'}
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id} className="rounded-xl shadow bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <CardHeader>
              <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`${isRTL ? 'text-right' : ''}`}>
                  <CardTitle className="text-lg text-indigo-700">
                    {isRTL ? 'آرڈر نمبر: ' : 'Order #'}{order._id}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'ڈسٹری بیوٹر: ' : 'Distributor: '}{order.customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(isRTL ? 'ur-PK' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className={`flex flex-col items-end gap-2 ${isRTL ? 'items-start' : 'items-end'}`}>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                  {/* Delivery type select */}
                  <Select
                    value={order.orderType}
                    onValueChange={(value: 'bilti' | 'delivery') => handleDeliveryTypeChange(order._id, value)}
                  >
                    <SelectTrigger className="w-[128px] bg-blue-100 text-blue-700 border-blue-300">
                      <SelectValue placeholder={isRTL ? 'ڈیلیوری ٹائپ' : 'Delivery Type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bilti">{isRTL ? 'بلٹی' : 'Bilti'}</SelectItem>
                      <SelectItem value="delivery">{isRTL ? 'ڈیلیوری' : 'Delivery'}</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Status select (already present) */}
                  <Select
                    value={order.status}
                    onValueChange={(value: Order['status']) => handleStatusChange(order._id, value)}
                  >
                    <SelectTrigger className="w-[140px] bg-purple-100 text-purple-700 border-purple-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{isRTL ? 'زیر التواء' : 'Pending'}</SelectItem>
                      <SelectItem value="confirmed">{isRTL ? 'تصدیق شدہ' : 'Confirmed'}</SelectItem>
                      <SelectItem value="shipped">{isRTL ? 'روانہ' : 'Shipped'}</SelectItem>
                      <SelectItem value="delivered">{isRTL ? 'پہنچا دیا گیا' : 'Delivered'}</SelectItem>
                      <SelectItem value="cancelled">{isRTL ? 'منسوخ' : 'Cancelled'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className={`font-medium ${isRTL ? 'text-right' : ''}`}>
                  {isRTL ? 'آرڈر کی تفصیلات:' : 'Order Items:'}
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-2 bg-gray-50 rounded gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image_link as string}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Text Info */}
                      <div className="flex justify-between w-full">
                        <div className={`${isRTL ? 'text-right' : ''}`}>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {isRTL ? 'مقدار: ' : 'Quantity: '}{item.quantity}
                          </p>
                        </div>
                        <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                          <p className="font-medium">{item.price}</p>
                          <p className="text-sm text-muted-foreground">
                            {isRTL ? 'کل: ' : 'Total: '}PKR {(Number(formatPrice(item.price)) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
                <div className={`flex justify-between items-center pt-2 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-lg font-semibold">
                    {isRTL ? 'کل رقم:' : 'Total Amount:'}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    PKR {order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersManager;
