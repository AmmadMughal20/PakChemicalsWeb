import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'admin' | 'distributor';

export interface User extends Document
{
    name: string
    email?: string
    phone: string
    password: string
    address: string
    city: string
    businessName: string
    role: UserRole
    joiningDate: Date
    refreshToken: string
}

const UserSchema: Schema<User> = new Schema({
    name: {
        type: String,
        required: [true, 'Name is missing!'],
    },
    email: {
        type: String,
        sparse: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter valid email'],
        validate: [
            {
                validator: async function (this: User, value: string)
                {
                    if (!value) return true; // allow empty (sparse behavior)
                    const existingUser = await mongoose.models.User.findOne({ email: value });
                    return !existingUser || existingUser._id.equals(this._id);
                },
                message: 'Email already taken'
            }
        ]
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
    city: {
        type: String,
        maxlength: [30, 'City is too long'],
        trim: true,
        required: true
    },
    businessName: {
        type: String,
        maxlength: [100, 'Business Name is too long'],
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: [true, 'Password is missing!'],
    },
    role: { type: String, enum: ['admin', 'distributor'], default: 'distributor' },
    joiningDate: { type: Date, default: Date.now },
    refreshToken: { type: String }
}, { timestamps: true })

UserSchema.set('toJSON', {
    transform: function (doc, ret)
    {
        delete ret.password;
        return ret;
    }
});

UserSchema.set('toObject', {
    transform: function (doc, ret)
    {
        delete ret.password;
        return ret;
    }
});
const UserModel =
    (mongoose.models.User
        ? mongoose.model<User>('User')
        : mongoose.model<User>('User', UserSchema));

export default UserModel;
