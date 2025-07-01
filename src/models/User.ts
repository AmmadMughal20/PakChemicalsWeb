import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'admin' | 'distributor';

export interface User extends Document
{
    name: string
    email?: string
    phone: string
    password: string
    address?: string
    role: UserRole
    joingingDate: Date
}

const UserSchema: Schema<User> = new Schema({
    name: {
        type: String,
        required: [true, 'Name is missing!'],
        unique: true
    },
    email: {
        type: String,
        unique: [true, 'Email already taken'],
        sparse: true, // Optional field but still unique
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter valid email'],
        validate: {
            validator: function (this: User, value: string): boolean
            {
                if (this.role === 'admin' && !value)
                {
                    return false;
                }
                return true;
            },
            message: 'Email is required for admin users'
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone is missing!'],
        unique: [true, 'Phone number already taken'],
        match: [/^(?:\+92|0)3[0-9]{9}$/, 'Enter a valid Pakistani phone number']
    },
    address: {
        type: String,
        maxlength: [200, 'Address is too long'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is missing!'],
    },
    role: { type: String, enum: ['admin', 'distributor'], default: 'distributor' },
    joingingDate: { type: Date, default: Date.now },
}, { timestamps: true })

UserSchema.set('toJSON', {
    transform: function (doc, ret, options)
    {
        delete ret.password;
        return ret;
    }
});

UserSchema.set('toObject', {
    transform: function (doc, ret, options)
    {
        delete ret.password;
        return ret;
    }
});
const UserModel =
    (mongoose.models?.User as mongoose.Model<User>) ||
    mongoose.model<User>('User', UserSchema);

export default UserModel;
