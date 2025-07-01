
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

interface ProductsListProps {
  isRTL: boolean;
}

const ProductsList: React.FC<ProductsListProps> = ({ isRTL }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.products);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 0) return;
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    const quantity = quantities[productId] || 1;
    
    if (!product) return;

    if (quantity > product.stock) {
      toast({
        title: isRTL ? 'خرابی' : 'Error',
        description: isRTL ? 'اسٹاک میں اتنا مال نہیں ہے' : 'Not enough stock available',
        variant: 'destructive',
      });
      return;
    }

    dispatch(addToCart({
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      unit: product.unit,
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
            <Card key={product.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <CardTitle className={`text-lg ${isRTL ? 'text-right' : ''}`}>
                  {product.name}
                </CardTitle>
                <CardDescription className={`${isRTL ? 'text-right' : ''}`}>
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">
                      {isRTL ? 'اسٹاک: ' : 'Stock: '}{product.stock} {product.unit}
                    </Badge>
                  </div>
                  
                  <div className={`text-xl font-bold text-primary ${isRTL ? 'text-right' : ''}`}>
                    ₨{product.price.toLocaleString()} {isRTL ? 'فی ' : 'per '}{product.unit}
                  </div>
                  
                  <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                      disabled={(quantities[product.id] || 1) <= 1}
                      aria-label={isRTL ? 'مقدار کم کریں' : 'Decrease quantity'}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                      className={`w-20 text-center ${isRTL ? 'text-right' : ''}`}
                      aria-label={isRTL ? 'مقدار' : 'Quantity'}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                      disabled={(quantities[product.id] || 1) >= product.stock}
                      aria-label={isRTL ? 'مقدار بڑھائیں' : 'Increase quantity'}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full mt-4"
                  disabled={product.stock === 0}
                  aria-label={`${isRTL ? 'کارٹ میں شامل کریں' : 'Add to cart'} ${product.name}`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 
                    ? (isRTL ? 'ختم' : 'Out of Stock')
                    : (isRTL ? 'کارٹ میں شامل کریں' : 'Add to Cart')
                  }
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
