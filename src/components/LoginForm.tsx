
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { toast } from '@/hooks/use-toast';

interface LoginFormProps
{
  isRTL: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isRTL }) =>
{
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) =>
  {
    e.preventDefault();

    if (!phone || !password)
    {
      toast({
        title: isRTL ? 'خرابی' : 'Error',
        description: isRTL ? 'تمام فیلڈز بھریں' : 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    dispatch(loginStart());

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    try
    {
      const res = await fetch(baseUrl + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok)
      {
        throw new Error(data.error || 'Login failed');
      }

      dispatch(loginSuccess(data.user));

      toast({
        title: isRTL ? 'کامیابی' : 'Success',
        description: isRTL ? 'کامیابی سے لاگ ان ہو گئے' : 'Successfully logged in',
      });

      // Optional: Save token in localStorage or cookie
      localStorage.setItem('token', data.token);
    }
    catch (error)
    {
      dispatch(loginFailure());
      toast({
        title: isRTL ? 'خرابی' : 'Error',
        description: error instanceof Error ? error.message : (isRTL ? 'لاگ ان میں خرابی' : 'Login failed'),
        variant: 'destructive',
      });
    }
    finally
    {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'داخل ہوں' : 'Login'}
          </CardTitle>
          <CardDescription className={`${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'اپنا موبائل نمبر اور پاس ورڈ درج کریں' : 'Enter your mobile number and password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className={`${isRTL ? 'text-right block' : ''}`}>
                {isRTL ? 'موبائل نمبر' : 'Mobile Number'}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={isRTL ? '03214884763' : '03214884763'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${isRTL ? 'text-right' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
                required
                aria-label={isRTL ? 'موبائل نمبر' : 'Mobile Number'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className={`${isRTL ? 'text-right block' : ''}`}>
                {isRTL ? 'پاس ورڈ' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={isRTL ? 'پاس ورڈ' : 'Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${isRTL ? 'text-right' : ''}`}
                required
                aria-label={isRTL ? 'پاس ورڈ' : 'Password'}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              aria-label={isRTL ? 'داخل ہوں' : 'Login'}
            >
              {loading ? (isRTL ? 'انتظار کریں...' : 'Please wait...') : (isRTL ? 'داخل ہوں' : 'Login')}
            </Button>
          </form>

          <div className={`mt-4 text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
            <p className="font-medium">{isRTL ? 'ڈیمو اکاؤنٹس:' : 'Demo Accounts:'}</p>
            <p>{isRTL ? 'ایڈمن:' : 'Admin:'} 03214884763 / Test@123</p>
            <p>{isRTL ? 'ڈسٹری بیوٹر:' : 'Distributor:'} 03007654321 / dist123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
