
import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { SearchWithVoice } from '@/components/ui/search-with-voice';
import Image from 'next/image';

interface ProductsListProps
{
  isRTL: boolean;
}

const ProductsList: React.FC<ProductsListProps> = ({ isRTL }) =>
{
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.products);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search query
  const filteredProducts = useMemo(() =>
  {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(product =>
      (isRTL ? product.title_urdu : product.title_english).toLowerCase().includes(query) ||
      (isRTL ? product.desc_urdu : product.desc_english).toLowerCase().includes(query) ||
      (isRTL ? product.category_urdu : product.category_english).toLowerCase().includes(query)
    );
  }, [products, searchQuery, isRTL]);

  const handleSearch = (query: string) =>
  {
    setSearchQuery(query);
  };

  const handleQuantityChange = (productId: string, quantity: number) =>
  {
    if (quantity < 0) return;
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleAddToCart = (productId: string) =>
  {
    const product = products.find(p => p.productCode === productId);
    const quantity = quantities[productId] || 1;

    if (!product) return;

    // if (quantity > product.stock)
    // {
    //   toast({
    //     title: isRTL ? 'خرابی' : 'Error',
    //     description: isRTL ? 'اسٹاک میں اتنا مال نہیں ہے' : 'Not enough stock available',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

    dispatch(addToCart({
      id: Date.now().toString(),
      productId: product.productCode,
      name: isRTL ? product.title_urdu : product.title_english,
      price: isRTL ? product.price_urdu : product.price_english,
      quantity,
      unit: isRTL ? product.unit_urdu : product.unit_english,
    }));

    toast({
      title: isRTL ? 'کامیابی' : 'Success',
      description: isRTL ? 'کارٹ میں شامل ہو گیا' : 'Added to cart successfully',
    });

    // Reset quantity
    setQuantities(prev => ({ ...prev, [productId]: 1 }));
  };

  return (
    <div className="space-y-4">
      {/* Fixed Search Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <h2 className="text-xl font-semibold">
            {isRTL ? 'دستیاب پروڈکٹس' : 'Available Products'}
          </h2>

          <SearchWithVoice
            placeholder={isRTL ? 'پروڈکٹ تلاش کریں...' : 'Search products...'}
            onSearch={handleSearch}
            isRTL={isRTL}
            className="w-full sm:w-80"
          />
        </div>

        {searchQuery && (
          <div className={`text-sm text-muted-foreground mt-2 ${isRTL ? 'text-right' : ''}`}>
            {filteredProducts.length} {isRTL ? 'پروڈکٹس ملے' : 'products found'}
          </div>
        )}
      </div>

      {/* Scrollable Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery
              ? (isRTL ? 'کوئی پروڈکٹ نہیں ملا' : 'No products found')
              : (isRTL ? 'کوئی پروڈکٹ دستیاب نہیں' : 'No products available')
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          {filteredProducts.map((product) => (
            <Card key={product.productCode} className="h-full flex flex-col">
              <CardHeader>
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Image
                    src={product.image_link}
                    alt={isRTL ? product.title_urdu : product.title_english}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <CardTitle className={`text-lg ${isRTL ? 'text-right' : ''}`}>
                  {isRTL ? product.title_urdu : product.title_english}
                </CardTitle>
                <CardDescription className={`${isRTL ? 'text-right' : ''}`}>
                  {isRTL ? product.desc_urdu : product.desc_english}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                    <Badge variant="secondary">{isRTL ? product.category_urdu : product.category_english}</Badge>
                    <Badge variant="outline">
                      {isRTL ? 'اسٹاک: ' : 'Stock: '}{isRTL ? product.unit_urdu : product.unit_english}
                    </Badge>
                  </div>

                  <div className={`text-xl font-bold text-primary ${isRTL ? 'text-right' : ''}`}>
                    {isRTL ? product.price_urdu : product.price_english} {isRTL ? 'فی ' : 'per '}{isRTL ? product.unit_urdu : product.unit_english}
                  </div>

                  <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(product.productCode, (quantities[product.productCode] || 1) - 1)}
                      disabled={(quantities[product.productCode] || 1) <= 1}
                      aria-label={isRTL ? 'مقدار کم کریں' : 'Decrease quantity'}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      // max={product.stock}
                      value={quantities[product.productCode] || 1}
                      onChange={(e) => handleQuantityChange(product.productCode, parseInt(e.target.value) || 1)}
                      className={`w-20 text-center ${isRTL ? 'text-right' : ''}`}
                      aria-label={isRTL ? 'مقدار' : 'Quantity'}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(product.productCode, (quantities[product.productCode] || 1) + 1)}
                      // disabled={(quantities[product.productCode] || 1) >= product.stock}
                      aria-label={isRTL ? 'مقدار بڑھائیں' : 'Increase quantity'}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => handleAddToCart(product.productCode)}
                  className="w-full mt-4"
                  // disabled={product.stock === 0}
                  aria-label={`${isRTL ? 'کارٹ میں شامل کریں' : 'Add to cart'} ${isRTL ? product.title_urdu : product.title_english}`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {/* {product.stock === 0
                    ? (isRTL ? 'ختم' : 'Out of Stock')
                    : (isRTL ? 'کارٹ میں شامل کریں' : 'Add to Cart')
                  } */}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
