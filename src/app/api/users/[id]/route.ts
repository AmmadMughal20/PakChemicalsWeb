import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

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

