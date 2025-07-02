
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { History, LogOut, Menu, Package, ShoppingCart, User, X } from 'lucide-react';
import React, { useState } from 'react';
import CartView from './distributor/CartView';
import OrdersHistory from './distributor/OrdersHistory';
import ProductsList from './distributor/ProductsList';
import ProfileManager from './distributor/ProfileManager';

interface DistributorDashboardProps
{
  isRTL: boolean;
  toggleRTL: () => void;
}

const DistributorDashboard: React.FC<DistributorDashboardProps> = ({ isRTL, toggleRTL }) =>
{
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { items } = useAppSelector((state: RootState) => state.cart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const loadData = async () =>
  // {
  //   try
  //   {
  //     const [productsData, ordersData] = await Promise.all([
  //       productsAPI.getAll(),
  //       ordersAPI.getAll(),
  //     ]);

  //     dispatch(setProducts(productsData));

  //     const userOrders = ordersData
  //       .filter(order => order.distributorId === user?.id)
  //       .map((order: OrderItem) => ({
  //         ...order,
  //         deliveryType: order.deliveryType as 'bilti' | 'delivery',
  //       }));

  //     dispatch(setOrders(userOrders));
  //   } catch (error: unknown)
  //   {
  //     if (error instanceof Error)
  //     {
  //       console.error('Error loading data:', error.message);
  //     } else
  //     {
  //       console.error('Unknown error loading data:', error);
  //     }
  //   }
  // };

  // useEffect(() =>
  // {
  //   loadData();
  // }, []);

  const handleLogout = () =>
  {
    dispatch(logout());
  };

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={`h-screen bg-background flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          {/* Mobile menu button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isRTL ? 'مینو کھولیں' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Brand */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                <h1 className="text-sm font-bold brand-text-gradient leading-none">
                  Pak Chemicals
                </h1>
                <p className="text-xs text-muted-foreground leading-none">
                  {user?.businessName || (isRTL ? 'ڈسٹری بیوٹر پینل' : 'Distributor Panel')}
                </p>
              </div>
            </div>
          </div>

          {/* Header actions */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ThemeToggle isRTL={isRTL} />
            <Button variant="outline" onClick={toggleRTL} size="sm" className="hidden sm:flex">
              {isRTL ? 'EN' : 'اردو'}
            </Button>
            <span className="text-xs text-muted-foreground hidden lg:block">
              {isRTL ? 'خوش آمدید، ' : 'Welcome, '}{user?.name}
            </span>
            <Button variant="outline" onClick={handleLogout} size="sm" className="hidden sm:flex">
              <LogOut className="h-4 w-4 mr-1" />
              {isRTL ? 'باہر' : 'Logout'}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container px-4 py-4 space-y-3">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="outline" onClick={toggleRTL} size="sm" className="flex-1">
                  {isRTL ? 'English' : 'اردو'}
                </Button>
                <Button variant="outline" onClick={handleLogout} size="sm" className="flex-1">
                  <LogOut className="h-4 w-4 mr-1" />
                  {isRTL ? 'باہر نکلیں' : 'Logout'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {isRTL ? 'خوش آمدید، ' : 'Welcome, '}{user?.name}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Fixed Tabs and Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="products" className="flex flex-col h-full">
          {/* Fixed Tabs List */}
          <div className="flex-shrink-0 border-b bg-background px-4 pt-4">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1">
              <TabsTrigger
                value="products"
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm ${isRTL ? 'sm:flex-row-reverse' : ''}`}
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:block">{isRTL ? 'پروڈکٹس' : 'Products'}</span>
                <span className="sm:hidden">{isRTL ? 'پروڈکٹ' : 'Items'}</span>
              </TabsTrigger>
              <TabsTrigger
                value="cart"
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm relative ${isRTL ? 'sm:flex-row-reverse' : ''}`}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:block">{isRTL ? 'کارٹ' : 'Cart'}</span>
                <span className="sm:hidden">{isRTL ? 'کارٹ' : 'Cart'}</span>
                {cartItemsCount > 0 && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 sm:static sm:ml-1 text-xs px-1 min-w-5 h-5">
                    {cartItemsCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm ${isRTL ? 'sm:flex-row-reverse' : ''}`}
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:block">{isRTL ? 'آرڈر کی تاریخ' : 'Orders'}</span>
                <span className="sm:hidden">{isRTL ? 'آرڈر' : 'Orders'}</span>
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm ${isRTL ? 'sm:flex-row-reverse' : ''}`}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:block">{isRTL ? 'پروفائل' : 'Profile'}</span>
                <span className="sm:hidden">{isRTL ? 'پروفائل' : 'Profile'}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="products" className="h-full m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <ProductsList isRTL={isRTL} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="cart" className="h-full m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <CartView isRTL={isRTL} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="orders" className="h-full m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <OrdersHistory isRTL={isRTL} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="profile" className="h-full m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <ProfileManager isRTL={isRTL} />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default DistributorDashboard;
