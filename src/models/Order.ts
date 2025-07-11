// ✅ order.model.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface CustomerInfo
{
    name: string;
    phone: string;
    address: string;
    city: string;
}

export interface CartItem
{
    productCode: string; // changed from `id` to match frontend
    title: string;
    price: string;
    quantity: number;
    unit?: string;
    image_link?: string;
}

export interface OrderDocument extends Document
{
    orderType: 'delivery' | 'bilti';
    customer: CustomerInfo;
    orderAddress: string;
    orderCity: string;
    items: CartItem[];
    total: number;
    timestamp: string;
    user: Types.ObjectId;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

const CartItemSchema = new Schema<CartItem>(
    {
        productCode: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: String,
        image_link: String,
    },
    { _id: false }
);

const CustomerSchema = new Schema<CustomerInfo>(
    {
        name: { type: String, required: true },
        phone: {
            type: String,
            required: true,
            match: [/^(?:\+92|0)3[0-9]{9}$/, 'Enter a valid Pakistani phone number'],
        },
        address: { type: String, required: true },
        city: { type: String, required: true }
    },
    { _id: false }
);

const OrderSchema = new Schema<OrderDocument>(
    {
        customer: { type: CustomerSchema, required: true },
        items: { type: [CartItemSchema], required: true },
        total: { type: Number, required: true },
        timestamp: { type: String, required: true },
        orderType: { type: String, enum: ['delivery', 'bilti'], required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        orderAddress: { type: String, required: true },
        orderCity: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const OrderModel =
    (mongoose.models.Order
        ? mongoose.model<OrderDocument>('Order')
        : mongoose.model<OrderDocument>('Order', OrderSchema));

export default OrderModel;
