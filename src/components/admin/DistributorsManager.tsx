
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { Distributor } from '@/store/slices/distributorsSlice';
import { Edit, MapPin, Phone, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface DistributorsManagerProps
{
  isRTL: boolean;
}

const DistributorsManager: React.FC<DistributorsManagerProps> = ({ isRTL }) =>
{
  const { distributors } = useAppSelector((state: RootState) => state.distributors);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);
  const editingDistributor: Distributor | null = null;
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    businessName: '',
    address: '',
    city: '',
    password: '',
  });

  // const handleOpenDialog = (distributor?: Distributor) =>
  // {
  //   if (distributor)
  //   {
  //     setEditingDistributor(distributor);
  //     setFormData({
  //       phone: distributor.phone,
  //       name: distributor.name,
  //       businessName: distributor.businessName,
  //       address: distributor.address,
  //       city: (distributor as Distributor).city ?? '', // fallback if city doesn't exist yet
  //       password: '',
  //     });
  //   } else
  //   {
  //     setEditingDistributor(null);
  //     setFormData({
  //       phone: '',
  //       name: '',
  //       businessName: '',
  //       address: '',
  //       city: '',
  //       password: '',
  //     });
  //   }
  //   setIsDialogOpen(true);
  // };

  // const handleSubmit = async (e: React.FormEvent) =>
  // {
  //   e.preventDefault();

  //   try
  //   {
  //     const distributorData = {
  //       phone: formData.phone,
  //       name: formData.name,
  //       businessName: formData.businessName,
  //       address: formData.address,
  //       city: formData.city,
  //       isActive: true,
  //     };

  //     if (editingDistributor)
  //     {
  //       const updatedDistributor = await distributorsAPI.update(editingDistributor.id, distributorData);
  //       dispatch(updateDistributor({ ...updatedDistributor, id: editingDistributor.id }));
  //       toast({
  //         title: isRTL ? 'کامیابی' : 'Success',
  //         description: isRTL ? 'ڈسٹری بیوٹر اپڈیٹ ہو گیا' : 'Distributor updated successfully',
  //       });
  //     } else
  //     {
  //       const newDistributor = await distributorsAPI.create(distributorData);
  //       dispatch(addDistributor(newDistributor));
  //       toast({
  //         title: isRTL ? 'کامیابی' : 'Success',
  //         description: isRTL ? 'نیا ڈسٹری بیوٹر شامل ہو گیا' : 'New distributor added successfully',
  //       });
  //     }

  //     setIsDialogOpen(false);
  //   } catch (error)
  //   {
  //     console.log(error)
  //     toast({
  //       title: isRTL ? 'خرابی' : 'Error',
  //       description: isRTL ? 'ڈسٹری بیوٹر محفوظ کرنے میں خرابی' : 'Failed to save distributor',
  //       variant: 'destructive',
  //     });
  //   }
  // };

  // const handleDelete = async (id: string) =>
  // {
  //   if (window.confirm(isRTL ? 'کیا آپ واقعی اس ڈسٹری بیوٹر کو ڈیلیٹ کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this distributor?'))
  //   {
  //     try
  //     {
  //       await distributorsAPI.delete(id);
  //       dispatch(deleteDistributor(id));
  //       toast({
  //         title: isRTL ? 'کامیابی' : 'Success',
  //         description: isRTL ? 'ڈسٹری بیوٹر ڈیلیٹ ہو گیا' : 'Distributor deleted successfully',
  //       });
  //     } catch (error)
  //     {
  //       console.log(error)
  //       toast({
  //         title: isRTL ? 'خرابی' : 'Error',
  //         description: isRTL ? 'ڈسٹری بیوٹر ڈیلیٹ کرنے میں خرابی' : 'Failed to delete distributor',
  //         variant: 'destructive',
  //       });
  //     }
  //   }
  // };

  return (
    <div className="space-y-4">
      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-xl font-semibold">
          {isRTL ? 'ڈسٹری بیوٹرز کا انتظام' : 'Distributors Management'}
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
            // onClick={() => handleOpenDialog()}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isRTL ? 'نیا ڈسٹری بیوٹر' : 'Add Distributor'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className={`${isRTL ? 'text-right' : ''}`}>
                {editingDistributor ? (isRTL ? 'ڈسٹری بیوٹر تبدیل کریں' : 'Edit Distributor') : (isRTL ? 'نیا ڈسٹری بیوٹر شامل کریں' : 'Add New Distributor')}
              </DialogTitle>
            </DialogHeader>
            <form
              // onSubmit={handleSubmit}
              className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={`${isRTL ? 'text-right block' : ''}`}>
                  {isRTL ? 'نام' : 'Name'}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`${isRTL ? 'text-right' : ''}`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName" className={`${isRTL ? 'text-right block' : ''}`}>
                  {isRTL ? 'کاروبار کا نام' : 'Business Name'}
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  className={`${isRTL ? 'text-right' : ''}`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className={`${isRTL ? 'text-right block' : ''}`}>
                  {isRTL ? 'موبائل نمبر' : 'Mobile Number'}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`${isRTL ? 'text-right' : ''}`}
                  placeholder="03214884763"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className={`${isRTL ? 'text-right block' : ''}`}>
                  {isRTL ? 'شہر' : 'City'}
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className={`${isRTL ? 'text-right' : ''}`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className={`${isRTL ? 'text-right block' : ''}`}>
                  {isRTL ? 'پتہ' : 'Address'}
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className={`${isRTL ? 'text-right' : ''}`}
                  required
                />
              </div>
              {!editingDistributor && (
                <div className="space-y-2">
                  <Label htmlFor="password" className={`${isRTL ? 'text-right block' : ''}`}>
                    {isRTL ? 'پاس ورڈ' : 'Password'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`${isRTL ? 'text-right' : ''}`}
                    placeholder={isRTL ? 'پاس ورڈ' : 'Password'}
                    required={!editingDistributor}
                  />
                </div>
              )}
              <Button type="submit" className="w-full">
                {editingDistributor ? (isRTL ? 'اپڈیٹ کریں' : 'Update') : (isRTL ? 'شامل کریں' : 'Add')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {distributors.map((distributor) => (
          <Card key={distributor.id}>
            <CardHeader>
              <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CardTitle className={`text-lg ${isRTL ? 'text-right' : ''}`}>
                  {distributor.name}
                </CardTitle>
                <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Button variant="outline" size="sm"
                  // onClick={() => handleOpenDialog(distributor)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm"
                  // onClick={() => handleDelete(distributor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className={`font-medium ${isRTL ? 'text-right' : ''}`}>
                  {distributor.businessName}
                </p>
                <div className={`flex items-center text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{distributor.phone}</span>
                </div>
                <div className={`flex items-center text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="font-semibold mr-1">{isRTL ? 'شہر:' : 'City:'}</span>
                  <span>{(distributor as Distributor).city ?? '-'}</span>
                </div>
                <div className={`flex items-start text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="h-4 w-4 mr-1 mt-0.5" />
                  <span className={`${isRTL ? 'text-right' : ''}`}>{distributor.address}</span>
                </div>
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Badge variant={distributor.isActive ? "default" : "secondary"}>
                    {distributor.isActive ? (isRTL ? 'فعال' : 'Active') : (isRTL ? 'غیر فعال' : 'Inactive')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(distributor.createdAt).toLocaleDateString(isRTL ? 'ur-PK' : 'en-US')}
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

export default DistributorsManager;

