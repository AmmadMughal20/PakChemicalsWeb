
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { RootState } from '@/store';
import { clearCart, removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import { MapPin, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface CartViewProps
{
  isRTL: boolean;
}

const CartView: React.FC<CartViewProps> = ({ isRTL }) =>
{
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  // Delivery type and address form states
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'bilti'>('delivery');
  const [useProfileAddress, setUseProfileAddress] = useState(true);
  const [customDeliveryAddress, setCustomDeliveryAddress] = useState('');
  const [biltiVendor, setBiltiVendor] = useState('');
  const [biltiDestination, setBiltiDestination] = useState('');

  const handleQuantityChange = (productId: string, newQuantity: number) =>
  {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId: string) =>
  {
    dispatch(removeFromCart(productId));
    toast({
      title: isRTL ? 'کامیابی' : 'Success',
      description: isRTL ? 'آئٹم کارٹ سے ہٹا دیا گیا' : 'Item removed from cart',
    });
  };

  const handlePlaceOrder = async () =>
  {
    if (items.length === 0)
    {
      toast({
        title: isRTL ? 'خرابی' : 'Error',
        description: isRTL ? 'کارٹ خالی ہے' : 'Cart is empty',
        variant: 'destructive',
      });
      return;
    }

    // Validations for address/vendor fields
    if (deliveryType === 'delivery' && !useProfileAddress && !customDeliveryAddress.trim())
    {
      toast({
        title: isRTL ? 'پتہ درکار ہے' : 'Address Required',
        description: isRTL ? 'براہ کرم نیا پتہ درج کریں' : 'Please enter a delivery address.',
        variant: 'destructive',
      });
      return;
    }
    if (deliveryType === 'bilti' && (!biltiVendor.trim() || !biltiDestination.trim()))
    {
      toast({
        title: isRTL ? 'مکمل معلومات درکار ہیں' : 'Incomplete Information',
        description: isRTL ? 'بلیٹی وینڈر اور پتہ ضروری ہیں' : 'Bilti vendor and destination address are required.',
        variant: 'destructive',
      });
      return;
    }

    try
    {
      // const orderData = {
      //   distributorId: user?.id,
      //   distributorName: user?.name,
      //   items: items.map(item => ({
      //     productId: item.productId,
      //     productName: item.name,
      //     quantity: item.quantity,
      //     price: item.price,
      //     unit: item.unit,
      //   })),
      //   total,
      //   deliveryType,
      //   deliveryAddress:
      //     deliveryType === 'delivery'
      //       ? (useProfileAddress ? user?.address : customDeliveryAddress.trim())
      //       : undefined,
      //   biltiVendor: deliveryType === 'bilti' ? biltiVendor.trim() : undefined,
      //   biltiDestination: deliveryType === 'bilti' ? biltiDestination.trim() : undefined,
      //   status: 'pending' as const,
      // };

      // const newOrder: Order = {
      //   _id: "",
      //   distributorId: '',
      //   distributorName: '',
      //   items: [],
      //   total: 200,
      //   deliveryType: 'bilti',
      //   status: 'pending',
      //   createdAt: '',
      //   updatedAt: ''
      // }
      // dispatch(addOrder(newOrder));
      // dispatch(clearCart());

      // Reset delivery form
      setDeliveryType('delivery');
      setUseProfileAddress(true);
      setCustomDeliveryAddress('');
      setBiltiVendor('');
      setBiltiDestination('');

      toast({
        title: isRTL ? 'کامیابی' : 'Success',
        description: isRTL ? 'آرڈر کامیابی سے بھیج دیا گیا' : 'Order placed successfully',
      });
    } catch (error)
    {
      console.log(error)
      toast({
        title: isRTL ? 'خرابی' : 'Error',
        description: isRTL ? 'آرڈر بھیجنے میں خرابی' : 'Failed to place order',
        variant: 'destructive',
      });
    }
  };

  if (items.length === 0)
  {
    return (
      <div className="text-center py-12 px-4">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {isRTL ? 'آپ کا کارٹ خالی ہے' : 'Your cart is empty'}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isRTL ? 'پروڈکٹس شامل کرنے کے لیے پروڈکٹس ٹیب پر جائیں' : 'Go to the Products tab to add items'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <h2 className="text-xl font-semibold">
          {isRTL ? 'آپ کا کارٹ' : 'Your Cart'}
        </h2>
        <Button variant="outline" onClick={() => dispatch(clearCart())} size="sm">
          {isRTL ? 'کارٹ خالی کریں' : 'Clear Cart'}
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                  <h3 className="font-medium text-base">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ₨{item.price.toLocaleString()} {isRTL ? 'فی ' : 'per '}{item.unit}
                  </p>
                </div>

                <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {isRTL ? 'مقدار:' : 'Qty:'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                        className={`w-16 text-center h-8 ${isRTL ? 'text-right' : ''}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between w-full sm:w-auto gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <p className="font-semibold text-primary">
                      {((parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0) * item.quantity).toLocaleString()}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delivery type & address form */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <Truck className="h-5 w-5 text-primary" />
            <span>{isRTL ? 'ڈیلیوری کی قسم' : 'Delivery Type'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Select value={deliveryType} onValueChange={val => setDeliveryType(val as 'delivery' | 'bilti')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isRTL ? 'قسم منتخب کریں' : 'Select type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery">{isRTL ? 'ڈیلیوری' : 'Delivery'}</SelectItem>
                <SelectItem value="bilti">{isRTL ? 'بلٹی' : 'Bilti'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DELIVERY */}
          {deliveryType === 'delivery' && (
            <div className="space-y-3 rounded-lg p-4 bg-secondary/50 border border-secondary">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="use-profile-address"
                  checked={useProfileAddress}
                  onCheckedChange={checked => setUseProfileAddress(Boolean(checked))}
                />
                <label htmlFor="use-profile-address" className="text-sm font-medium cursor-pointer select-none">
                  {isRTL ? 'پروفائل والے پتے کا استعمال کریں' : 'Use profile address'}
                </label>
              </div>
              {useProfileAddress && (
                <div className="flex items-center gap-2 text-sm border rounded-lg p-3 bg-primary/5 border-primary/20">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{user?.address || <span className="italic text-muted-foreground">{isRTL ? 'پتہ دستیاب نہیں' : 'No address provided'}</span>}</span>
                </div>
              )}
              {!useProfileAddress && (
                <div className="space-y-2">
                  <label className="text-sm font-medium block" htmlFor="new-delivery-addr">
                    {isRTL ? 'نیا ڈیلیوری پتہ' : 'New Delivery Address'}
                  </label>
                  <Input
                    id="new-delivery-addr"
                    value={customDeliveryAddress}
                    onChange={e => setCustomDeliveryAddress(e.target.value)}
                    placeholder={isRTL ? 'نیا پتہ' : 'Enter new delivery address'}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>
              )}
            </div>
          )}

          {/* BILTI */}
          {deliveryType === 'bilti' && (
            <div className="space-y-3 rounded-lg p-4 bg-secondary/50 border border-secondary">
              <div className="space-y-2">
                <label className="text-sm font-medium block" htmlFor="bilti-vendor">
                  {isRTL ? 'بلیٹی وینڈر' : 'Bilti Vendor'}
                </label>
                <Input
                  id="bilti-vendor"
                  value={biltiVendor}
                  onChange={e => setBiltiVendor(e.target.value)}
                  placeholder={isRTL ? 'بلیٹی وینڈر کا نام' : 'Enter bilti vendor'}
                  className={isRTL ? 'text-right' : ''}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium block" htmlFor="bilti-destination">
                  {isRTL ? 'مطلوبہ پتہ' : 'Bilti Destination Address'}
                </label>
                <Input
                  id="bilti-destination"
                  value={biltiDestination}
                  onChange={e => setBiltiDestination(e.target.value)}
                  placeholder={isRTL ? 'بلٹی کا پتہ' : 'Enter destination for bilti'}
                  className={isRTL ? 'text-right' : ''}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cart Summary */}
      <Card className="border-primary/20 sticky bottom-4 bg-background/95 backdrop-blur">
        <CardContent className="p-4">
          <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div className={`text-lg font-semibold ${isRTL ? 'text-right' : ''}`}>
              <span className="text-muted-foreground">{isRTL ? 'کل رقم: ' : 'Total: '}</span>
              <span className="text-primary">₨{total.toLocaleString()}</span>
            </div>
            <Button
              onClick={handlePlaceOrder}
              className="w-full sm:w-auto flex items-center gap-2"
              size="lg"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>{isRTL ? 'آرڈر بھیجیں' : 'Place Order'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartView;
