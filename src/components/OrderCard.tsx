'use client';

import { Badge } from '@/components/ui/badge';
import
{
    Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import
{
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Order } from '@/store/slices/ordersSlice';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import React from 'react';
import { Button } from './ui/button';

interface OrderCardProps
{
    order: Order;
    isRTL: boolean;
    isOpen: boolean;
    onToggle: () => void;
    handleStatusChange: (orderId: string, newStatus: Order['status']) => void;
    handleDeliveryTypeChange: (orderId: string, newType: 'bilti' | 'delivery') => void;
    formatPrice: (value: string | number) => string;
}

const OrderCard: React.FC<OrderCardProps> = ({
    order,
    isRTL,
    isOpen,
    onToggle,
    handleStatusChange,
    handleDeliveryTypeChange,
    formatPrice,
}) =>
{
    const handlePrint = async (e: React.MouseEvent) =>
    {
        e.stopPropagation();

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.top = '-10000px';
        iframe.style.left = '-10000px';
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        const receiptHtml = `
                <div style="width:360px; padding:16px; font-family:monospace; background:#ffffff; color:#000000; font-size:12px;">
                    <div style="text-align:center; border-bottom:1px solid #ccc; padding-bottom:8px; margin-bottom:8px;">
                        <h2 style="font-size:18px; font-weight:bold;">Pak Chemicals</h2>
                        <p>Lahore, Pakistan</p>
                        <p>Phone: 0321-1049837</p>
                    </div>
        
                    <p>${isRTL ? 'آرڈر نمبر' : 'Order No'}: <strong>${generateCustomStringFromDate(order.customer.name, new Date(order.createdAt))}</strong></p>
                    <p>${isRTL ? 'تاریخ' : 'Date'}: ${new Date(order.createdAt).toLocaleString()}</p>
                    <p>${isRTL ? 'کسٹمر' : 'Customer'}: ${order.customer.name}</p>
        
                    <div style="border-top:1px solid #ccc; border-bottom:1px solid #ccc; padding:8px 0; margin:8px 0;">
                        <div style="display:flex; justify-content:space-between; font-weight:bold;">
                            <span>${isRTL ? 'آئٹم' : 'Item'}</span>
                            <span>${isRTL ? 'کل' : 'Total'}</span>
                        </div>
                        ${order.items.map(item => `
                            <div style="display:flex; justify-content:space-between;">
                                <span>${item.title} x ${item.quantity}</span>
                                <span>PKR ${(Number(formatPrice(item.price)) * item.quantity).toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
        
                    <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:14px;">
                        <span>${isRTL ? 'کل رقم:' : 'Total Amount:'}</span>
                        <span>PKR ${order.total.toLocaleString()}</span>
                    </div>
        
                    <p style="text-align:center; font-size:11px; margin-top:12px;">
                        ${isRTL ? 'شکریہ' : 'Thank you for your purchase!'}
                    </p>
                </div>
            `;

        doc.body.innerHTML = receiptHtml;

        const canvas = await html2canvas(doc.body.firstElementChild as HTMLElement, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
        });

        document.body.removeChild(iframe); // clean up

        const dataUrl = canvas.toDataURL('image/png');

        // ✅ Trigger download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `receipt-${order._id}.png`; // File name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const getStatusBadgeVariant = (status: Order['status']) =>
    {
        switch (status)
        {
            case 'pending': return 'secondary';
            case 'confirmed': return 'default';
            case 'shipped': return 'outline';
            case 'delivered': return 'default';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    const getStatusText = (status: Order['status']) =>
    {
        if (isRTL)
        {
            switch (status)
            {
                case 'pending': return 'زیر التواء';
                case 'confirmed': return 'تصدیق شدہ';
                case 'shipped': return 'روانہ';
                case 'delivered': return 'پہنچا دیا گیا';
                case 'cancelled': return 'منسوخ';
                default: return status;
            }
        }
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    function generateCustomStringFromDate(prefix: string, dateInput: Date): string
    {
        const date = dateInput;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const firstWord = prefix.trim().split(/\s+/)[0]; // get first word, ignoring extra spaces

        return `${day}${month}${year}-${hours}${minutes}-${firstWord}`;
    }

    return (
        <>
            <Card className="relative group rounded-xl shadow bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl z-10 pointer-events-none" />
                <CardHeader
                    className="cursor-pointer"
                    onClick={onToggle}
                >
                    <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`${isRTL ? 'text-right' : ''}`}>
                            <CardTitle className="text-lg text-indigo-700">
                                {isRTL ? 'آرڈر نمبر: ' : 'Order No.: '}{generateCustomStringFromDate(order.customer.name, new Date(order.createdAt))}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {isRTL ? 'ڈسٹری بیوٹر: ' : 'Distributor: '}{order.customer.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString(isRTL ? 'ur-PK' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div className={`flex flex-row items-end gap-2 ${isRTL ? 'items-start' : 'items-end'}`}>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                                {getStatusText(order.status)}
                            </Badge>
                            <Select
                                value={order.orderType}
                                onValueChange={(value) => handleDeliveryTypeChange(order._id, value as 'bilti' | 'delivery')}
                            >
                                <SelectTrigger className="w-[128px] bg-blue-100 text-blue-700 border-blue-300">
                                    <SelectValue placeholder={isRTL ? 'ڈیلیوری ٹائپ' : 'Delivery Type'} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bilti">{isRTL ? 'بلٹی' : 'Bilti'}</SelectItem>
                                    <SelectItem value="delivery">{isRTL ? 'ڈیلیوری' : 'Delivery'}</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order._id, value as Order['status'])}
                            >
                                <SelectTrigger className="w-[140px] bg-purple-100 text-purple-700 border-purple-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">{isRTL ? 'زیر التواء' : 'Pending'}</SelectItem>
                                    <SelectItem value="confirmed">{isRTL ? 'تصدیق شدہ' : 'Confirmed'}</SelectItem>
                                    <SelectItem value="shipped">{isRTL ? 'روانہ' : 'Shipped'}</SelectItem>
                                    <SelectItem value="delivered">{isRTL ? 'پہنچا دیا گیا' : 'Delivered'}</SelectItem>
                                    <SelectItem value="cancelled">{isRTL ? 'منسوخ' : 'Cancelled'}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handlePrint}
                                title="Print Receipt"
                                className="text-xs text-blue-700 underline hover:text-blue-900"
                            >
                                🧾
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {isOpen && (
                    <CardContent>
                        <div className="space-y-3">
                            <h4 className={`font-medium ${isRTL ? 'text-right' : ''}`}>
                                {isRTL ? 'آرڈر کی تفصیلات:' : 'Order Items:'}
                            </h4>
                            <div className="space-y-2">
                                {order.items.map((item, index) => (
                                    <div key={index} className={`flex items-center p-2 bg-gray-50 rounded gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image_link as string}
                                                alt={item.title}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <div className={`${isRTL ? 'text-right' : ''}`}>
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {isRTL ? 'مقدار: ' : 'Quantity: '}{item.quantity}
                                                </p>
                                            </div>
                                            <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                                                <p className="font-medium">{item.price}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {isRTL ? 'کل: ' : 'Total: '}PKR {(Number(formatPrice(item.price)) * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={`flex justify-between items-center pt-2 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-lg font-semibold">
                                    {isRTL ? 'کل رقم:' : 'Total Amount:'}
                                </span>
                                <span className="text-lg font-bold text-primary">
                                    PKR {order.total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        </>)
};

export default OrderCard;
