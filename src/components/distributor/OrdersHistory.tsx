
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrdersHistoryProps
{
  isRTL: boolean;
}

const OrdersHistory: React.FC<OrdersHistoryProps> = ({ isRTL }) =>
{
  const { orders } = useSelector((state: RootState) => state.orders);

  const getDeliveryText = (type: 'bilti' | 'delivery') =>
    isRTL ? (type === 'bilti' ? 'بلٹی' : 'ڈیلیوری') : (type === 'bilti' ? 'Bilti' : 'Delivery');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-green-700/90">
        {isRTL ? 'آرڈر کی تاریخ' : 'Order History'}
      </h2>
      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order._id} className="bg-gradient-to-br from-pink-50 via-green-50 to-blue-50 rounded-xl shadow">
            <CardHeader>
              <div className="flex flex-col">
                <CardTitle className="text-indigo-700">{isRTL ? 'آرڈر نمبر: ' : 'Order #'}{order._id}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString(isRTL ? 'ur-PK' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 mt-2">
                  {isRTL ? 'ڈیلیوری: ' : 'Delivery: '}
                  {getDeliveryText(order.orderType)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="mb-2 space-y-1">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>{item.title} ({item.quantity} {item.unit})</span>
                    {/* <span>₨{formatPrice(item.price) * item.quantity}</span> */}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">{isRTL ? 'مجموعی رقم:' : 'Total:'}</span>
                <span className="font-bold text-pink-700">₨{order.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersHistory;
