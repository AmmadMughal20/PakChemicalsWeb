import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document
{
    productCode: string;
    title_english: string;
    desc_english: string;
    category_english: string;
    price_english: string;
    unit_english: string;
    image_link: string;
    title_urdu: string;
    desc_urdu: string;
    category_urdu: string;
    price_urdu: string;
    unit_urdu: string;
}

const ProductSchema: Schema<Product> = new Schema({
    productCode: {
        type: String,
        required: [true, 'Product code is required'],
        unique: true,
        trim: true
    },
    title_english: {
        type: String,
        required: [true, 'English title is required'],
        trim: true
    },
    desc_english: {
        type: String,
        required: [true, 'English description is required'],
        trim: true
    },
    category_english: {
        type: String,
        required: [true, 'English category is required'],
        trim: true
    },
    price_english: {
        type: String,
        required: [true, 'English price is required'],
        trim: true
    },
    unit_english: {
        type: String,
        required: [true, 'English unit is required'],
        trim: true
    },
    image_link: {
        type: String,
        required: [true, 'Image link is required'],
        trim: true
    },
    title_urdu: {
        type: String,
        required: [true, 'Urdu title is required'],
        trim: true
    },
    desc_urdu: {
        type: String,
        required: [true, 'Urdu description is required'],
        trim: true
    },
    category_urdu: {
        type: String,
        required: [true, 'Urdu category is required'],
        trim: true
    },
    price_urdu: {
        type: String,
        required: [true, 'Urdu price is required'],
        trim: true
    },
    unit_urdu: {
        type: String,
        required: [true, 'Urdu unit is required'],
        trim: true
    }
}, { timestamps: true });

const ProductModel =
    (mongoose.models?.Product as mongoose.Model<Product>) ||
    mongoose.model<Product>('Product', ProductSchema);

export default ProductModel;
