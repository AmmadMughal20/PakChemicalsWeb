import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import
{
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchWithVoice } from '@/components/ui/search-with-voice';
import { toast } from '@/hooks/use-toast';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import
{
  deleteProduct,
  Product,
  updateProduct
} from '@/store/slices/productsSlice';
import { fetchProducts } from '@/store/thunks/productThunks';
import { Edit, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const demoImages = [
  '/placeholder.svg?height=200&width=200',
  'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=200&q=80',
];

const ProductsManager = () =>
{
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state: RootState) => state.products);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    productCode: '',
    title: '',
    desc: '',
    price: '',
    category: '',
    unit: '',
    image: demoImages[0],
    title_urdu: '',
    desc_urdu: '',
    category_urdu: '',
    price_urdu: '',
    unit_urdu: '',
  });

  useEffect(() =>
  {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() =>
  {
    const query = searchQuery.toLowerCase();
    return products.filter((product) =>
      isRTL
        ? product.title_urdu.toLowerCase().includes(query)
        : product.title_english.toLowerCase().includes(query)
    );
  }, [products, searchQuery, isRTL]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const file = e.target.files?.[0];
    if (!file) return;

    try
    {
      // Step 1: Get signature
      const res = await fetch('/api/cloudinary-signature', { method: 'POST' });

      const { signature, timestamp, apiKey, cloudName } = await res.json();

      // Step 2: Upload to Cloudinary
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', apiKey);
      form.append('timestamp', timestamp);
      form.append('signature', signature);
      form.append('folder', "products");

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      });

      const data = await uploadRes.json();

      if (data.secure_url)
      {
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        toast({ title: 'Image uploaded', description: 'Image successfully uploaded to Cloudinary.' });
      }
      else
      {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error: unknown)
    {
      if (error instanceof Error)
      {
        console.error('Error loading data:', error.message);
      } else
      {
        console.error('Unknown error loading data:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) =>
  {
    e.preventDefault();

    if (!formData.image || formData.image.startsWith('blob:'))
    {
      return toast({ title: 'Upload Image First', description: 'Please upload the image before submitting.', variant: 'destructive' });
    }

    const data = {
      productCode: formData.productCode,
      title_english: formData.title,
      desc_english: formData.desc,
      category_english: formData.category,
      price_english: formData.price,
      unit_english: formData.unit,
      title_urdu: formData.title_urdu,
      desc_urdu: formData.desc_urdu,
      category_urdu: formData.category_urdu,
      price_urdu: formData.price_urdu,
      unit_urdu: formData.unit_urdu,
      image_link: formData.image,
    };

    try
    {
      if (editingProductId)
      {
        await dispatch(updateProduct({ _id: editingProductId, ...data }));
        toast({ title: 'Updated', description: 'Product updated successfully.' });
      } else
      {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok)
        {
          const { error } = await response.json();
          throw new Error(error || 'Failed to add product');
        }

        dispatch(fetchProducts());
        toast({ title: 'Added', description: 'Product added successfully.' });
      }

      setIsDialogOpen(false);
      setEditingProductId(null);
    } catch (error: unknown)
    {
      if (error instanceof Error)
      {
        {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
      } else
      {
        console.log(error)
      }
    };
  }

  const handleDelete = async (id: string) =>
  {
    if (window.confirm('Delete this product?'))
    {
      try
      {
        await dispatch(deleteProduct(id))
        toast({ title: 'Deleted', description: 'Product deleted successfully.' });
      } catch
      {
        toast({ title: 'Error', description: 'Failed to delete product.', variant: 'destructive' });
      }
    }
  };

  const handleEdit = (product: Product) =>
  {
    setEditingProductId(product._id);
    setFormData({
      productCode: product.productCode,
      title: product.title_english,
      desc: product.desc_english,
      category: product.category_english,
      price: product.price_english,
      unit: product.unit_english,
      title_urdu: product.title_urdu,
      desc_urdu: product.desc_urdu,
      category_urdu: product.category_urdu,
      price_urdu: product.price_urdu,
      unit_urdu: product.unit_urdu,
      image: product.image_link,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Products</h2>
        <div className="flex gap-2">
          <SearchWithVoice
            placeholder="Search products..."
            onSearch={setSearchQuery}
            isRTL={isRTL}
          />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
          <Button variant="outline" onClick={() => setIsRTL(!isRTL)}>
            Toggle Language
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product._id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{isRTL ? product.title_urdu : product.title_english}</CardTitle>
                <div className="flex gap-1">
                  <Button size="icon" onClick={() => handleEdit(product)}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" onClick={() => handleDelete(product._id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Image
                src={product.image_link}
                alt={product.title_english}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <p>{isRTL ? product.desc_urdu : product.desc_english}</p>
              <Badge>{isRTL ? product.category_urdu : product.category_english}</Badge>
              <p>
                {isRTL ? `قیمت: ${product.price_urdu} / ${product.unit_urdu}` : `Price: ${product.price_english} / ${product.unit_english}`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProductId ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl max-h-[calc(100vh-80px)] overflow-y-auto px-6 py-4 space-y-8 mx-auto"
          >
            {/* Product Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Product Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="productCode">Product Code</Label>
                  <Input id="productCode" value={formData.productCode} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="category">Category (English)</Label>
                  <Input id="category" value={formData.category} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="category_urdu" className="block text-right">زمرہ (اردو)</Label>
                  <Input id="category_urdu" value={formData.category_urdu} onChange={handleInputChange} required dir="rtl" />
                </div>
              </div>
            </div>

            {/* English Fields */}
            <div>
              <h3 className="text-lg font-semibold mb-3">English Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="desc">Description</Label>
                  <Input id="desc" value={formData.desc} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" value={formData.price} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" value={formData.unit} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            {/* Urdu Fields */}
            <div dir="rtl">
              <h3 className="text-lg font-semibold mb-3 text-right">تفصیلات (اردو)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_urdu" className="block text-right">عنوان</Label>
                  <Input id="title_urdu" value={formData.title_urdu} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="desc_urdu" className="block text-right">تفصیل</Label>
                  <Input id="desc_urdu" value={formData.desc_urdu} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="price_urdu" className="block text-right">قیمت</Label>
                  <Input id="price_urdu" value={formData.price_urdu} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="unit_urdu" className="block text-right">یونٹ</Label>
                  <Input id="unit_urdu" value={formData.unit_urdu} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Product Image</h3>
              <Label htmlFor="image_upload">Upload Image</Label>
              <Input type="file" id="image_upload" ref={fileInputRef} onChange={handleImageUpload} />
              {formData.image && (
                <Image src={formData.image} alt="Preview" className="mt-2 max-h-40 rounded border" />
              )}
            </div>

            {/* Submit */}
            <div>
              <Button type="submit" className="w-full">
                {editingProductId ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>


        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManager;
