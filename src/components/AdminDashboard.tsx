
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { fetchProducts } from '@/store/thunks/productThunks';
import { LogOut, Package, ShoppingCart, Users } from 'lucide-react';
import React, { useEffect } from 'react';
import DistributorsManager from './admin/DistributorsManager';
import OrdersManager from './admin/OrdersManager';
import ProductsManager from './admin/ProductsManager';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface AdminDashboardProps
{
  isRTL: boolean;
  toggleRTL: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isRTL, toggleRTL }) =>
{
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { distributors } = useAppSelector((state: RootState) => state.distributors);
  const { orders } = useAppSelector((state: RootState) => state.orders);

  const { products } = useAppSelector((state: RootState) => state.products);

  useEffect(() =>
  {
    dispatch(fetchProducts());
  }, [dispatch]);

  // useEffect(() =>
  // {
  //   loadData();
  // }, []);

  // const loadData = async () =>
  // {
  //   try
  //   {
  //     const [productsData, distributorsData, ordersData] = await Promise.all([
  //       productsAPI.getAll(),
  //       distributorsAPI.getAll(),
  //       ordersAPI.getAll(),
  //     ]);

  //     dispatch(setProducts(productsData));
  //     // Add default city property to distributors if missing
  //     const distributorsWithCity = distributorsData.map((distributor: any) => ({
  //       ...distributor,
  //       city: distributor.city || '', // Provide default empty string if city is missing
  //     }));
  //     dispatch(setDistributors(distributorsWithCity));
  //     // Transform ordersData: force deliveryType as 'bilti' | 'delivery'
  //     const typedOrders = ordersData.map((order: any) => ({
  //       ...order,
  //       deliveryType: order.deliveryType as 'bilti' | 'delivery',
  //     }));
  //     dispatch(setOrders(typedOrders));
  //   } catch (error)
  //   {
  //     console.error('Error loading data:', error);
  //   }
  // };

  const handleLogout = () =>
  {
    dispatch(logout());
  };

  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <h1 className="text-xl font-semibold text-gray-900">
                {isRTL ? 'ایڈمن پینل' : 'Admin Dashboard'}
              </h1>
            </div>
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Button variant="outline" onClick={toggleRTL} size="sm">
                {isRTL ? 'English' : 'اردو'}
              </Button>
              <span className="text-sm text-gray-600">
                {isRTL ? 'خوش آمدید، ' : 'Welcome, '}{user?.name}
              </span>
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="h-4 w-4" />
                {isRTL ? 'باہر نکلیں' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isRTL ? 'کل پروڈکٹس' : 'Total Products'}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isRTL ? 'کل ڈسٹری بیوٹرز' : 'Total Distributors'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{distributors.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isRTL ? 'زیر التواء آرڈرز' : 'Pending Orders'}
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">
              {isRTL ? 'پروڈکٹس' : 'Products'}
            </TabsTrigger>
            <TabsTrigger value="distributors">
              {isRTL ? 'ڈسٹری بیوٹرز' : 'Distributors'}
            </TabsTrigger>
            <TabsTrigger value="orders">
              {isRTL ? 'آرڈرز' : 'Orders'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="distributors" className="space-y-4">
            <DistributorsManager isRTL={isRTL} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <OrdersManager isRTL={isRTL} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
