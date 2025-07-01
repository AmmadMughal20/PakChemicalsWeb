
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logout } from '@/store/slices/authSlice';
import { setProducts } from '@/store/slices/productsSlice';
import { setDistributors } from '@/store/slices/distributorsSlice';
import { setOrders } from '@/store/slices/ordersSlice';
import { productsAPI, distributorsAPI, ordersAPI } from '@/services/api';
import ProductsManager from './admin/ProductsManager';
import DistributorsManager from './admin/DistributorsManager';
import OrdersManager from './admin/OrdersManager';
import { LogOut, Package, Users, ShoppingCart } from 'lucide-react';
import { fetchProducts } from '@/store/thunks/productThunks';

interface AdminDashboardProps
{
  isRTL: boolean;
  toggleRTL: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isRTL, toggleRTL }) =>
{
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  // const { products } = useSelector((state: RootState) => state.products);
  const { distributors } = useSelector((state: RootState) => state.distributors);
  const { orders } = useSelector((state: RootState) => state.orders);

  const { products, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() =>
  {
    dispatch(fetchProducts() as any);
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
            <ProductsManager isRTL={isRTL} />
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
