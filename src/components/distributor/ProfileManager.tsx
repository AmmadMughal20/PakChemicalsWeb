
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { loginSuccess } from '@/store/slices/authSlice';
import { User, MapPin, Building, Phone, Save, MapPinIcon } from 'lucide-react';

interface ProfileManagerProps {
  isRTL: boolean;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ isRTL }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    phone: user?.phone || '',
    city: user?.city || '',
    address: user?.address || '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...formData,
    };

    dispatch(loginSuccess(updatedUser));
    setIsEditing(false);
    
    toast({
      title: isRTL ? 'کامیابی' : 'Success',
      description: isRTL ? 'پروفائل اپڈیٹ ہو گئی' : 'Profile updated successfully',
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      businessName: user?.businessName || '',
      phone: user?.phone || '',
      city: user?.city || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <User className="h-6 w-6 text-primary" />
            <span>{isRTL ? 'پروفائل کا انتظام' : 'Profile Management'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{isRTL ? 'نام' : 'Name'}</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className={`${isRTL ? 'text-right' : ''}`}
                placeholder={isRTL ? 'آپ کا نام' : 'Your name'}
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{isRTL ? 'فون نمبر' : 'Phone Number'}</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className={`${isRTL ? 'text-right' : ''}`}
                placeholder={isRTL ? 'فون نمبر' : 'Phone number'}
              />
            </div>
          </div>

          {/* Business Name Field */}
          <div className="space-y-2">
            <Label htmlFor="businessName" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{isRTL ? 'کاروبار کا نام' : 'Business Name'}</span>
            </Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              disabled={!isEditing}
              className={`${isRTL ? 'text-right' : ''}`}
              placeholder={isRTL ? 'آپ کے کاروبار کا نام' : 'Your business name'}
            />
          </div>

          {/* City Field */}
          <div className="space-y-2">
            <Label htmlFor="city" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <span>{isRTL ? 'شہر' : 'City'}</span>
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              disabled={!isEditing}
              className={`${isRTL ? 'text-right' : ''}`}
              placeholder={isRTL ? 'آپ کا شہر' : 'Your city'}
            />
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <Label htmlFor="address" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{isRTL ? 'پتہ' : 'Address'}</span>
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              className={`${isRTL ? 'text-right' : ''} min-h-[80px]`}
              placeholder={isRTL ? 'آپ کا مکمل پتہ' : 'Your complete address'}
            />
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{isRTL ? 'پروفائل میں تبدیلی' : 'Edit Profile'}</span>
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>{isRTL ? 'محفوظ کریں' : 'Save Changes'}</span>
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  {isRTL ? 'منسوخ' : 'Cancel'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManager;
