import mongoose, { Schema, Document, Types } from 'mongoose';

export interface CustomerInfo
{
    name: string;
    phone: string;
    address: string;
}

export interface CartItem
{
    id: string;
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
    items: CartItem[];
    total: number;
    timestamp: string;
    user: Types.ObjectId; // ✅ Strongly typed reference to User
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'; // ✅ Add this line
}

const CartItemSchema = new Schema<CartItem>(
    {
        id: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String },
        image_link: { type: String },
    },
    { _id: false } // Prevents Mongoose from adding _id to each cart item
);

const CustomerSchema = new Schema<CustomerInfo>(
    {
        name: { type: String, required: true },
        phone: {
            type: String,
            required: true,
            match: [/^(?:\+92|0)3[0-9]{9}$/, 'Enter a valid Pakistani phone number']
        },
        address: { type: String, required: true },
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
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending', // ✅ New orders default to pending
            required: true
        }
    },
    { timestamps: true }
);

const OrderModel =
    (mongoose.models?.Order as mongoose.Model<OrderDocument>) ||
    mongoose.model<OrderDocument>('Order', OrderSchema);

export default OrderModel;
