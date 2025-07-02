import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest)
{
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('id');

    await dbConnect();

    if (!userId || !isValidObjectId(userId))
    {
        return NextResponse.json(
            { error: 'Invalid or missing user ID' },
            { status: 400 }
        );
    }

    try
    {
        const user = await UserModel.findById(userId).select('-password');

        if (!user)
        {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (err: unknown)
    {
        if (err instanceof Error)
        {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
    }
}

// PUT /api/users?id=
export async function PUT(req: NextRequest)
{
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('id');

    await dbConnect();


    // ✅ Check for valid ObjectId
    if (!isValidObjectId(userId))
    {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await req.json();
    const { phone, email, password } = body;

    // ✅ Validate phone format if updating
    if (phone)
    {
        const phoneRegex = /^(?:\+92|0)3[0-9]{9}$/;
        if (!phoneRegex.test(phone))
        {
            return NextResponse.json(
                { error: 'Enter a valid Pakistani phone number' },
                { status: 400 }
            );
        }
    }

    // ✅ Validate email format if updating
    if (email)
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
        {
            return NextResponse.json(
                { error: 'Enter a valid email address' },
                { status: 400 }
            );
        }
    }

    // ✅ Validate and hash password if present
    if (password)
    {
        if (password.length < 6)
        {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }
        body.password = await bcrypt.hash(password, 10);
    }

    try
    {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!updatedUser)
        {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (err: unknown)
    {
        if (err instanceof Error)
        {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        // fallback for non-Error objects
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
    }
}

// DELETE /api/users?id=
export async function DELETE(req: NextRequest)
{
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('id');

    await dbConnect();


    // ✅ Validate MongoDB ObjectId format
    if (!isValidObjectId(userId))
    {
        return NextResponse.json(
            { error: 'Invalid user ID format' },
            { status: 400 }
        );
    }

    try
    {
        const deleted = await UserModel.findByIdAndDelete(userId);

        if (!deleted)
        {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (err: unknown)
    {
        if (err instanceof Error)
        {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        // fallback for non-Error objects
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
    }
}

