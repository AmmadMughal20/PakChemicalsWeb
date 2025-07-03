import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // A helper to connect MongoDB
import UserModel from '@/models/User'; // Your model path
import bcrypt from 'bcryptjs';
import { isValidObjectId } from 'mongoose';


interface UserPost
{
    name: string;
    phone: string;
    password: string;
    role: string;
    email?: string;
    address?: string;
}
// GET /api/users
export async function GET()
{
    await dbConnect();
    const users = await UserModel.find();
    return NextResponse.json(users);
}

// POST /api/users
export async function POST(req: NextRequest)
{
    await dbConnect();

    // ✅ Read raw body string
    const rawBody = await req.text();

    if (!rawBody)
    {
        return NextResponse.json(
            { error: 'Request body is missing' },
            { status: 400 }
        );
    }

    let body: UserPost;

    try
    {
        body = JSON.parse(rawBody);
    } catch (error)
    {
        return NextResponse.json(
            { message: 'Invalid JSON format', error: error },
            { status: 400 }
        );
    }

    const { name, phone, password, role, email } = body;

    // ✅ Required fields
    if (!name || !phone || !password || !role)
    {
        return NextResponse.json(
            { error: 'Name, phone, password, and role are required' },
            { status: 400 }
        );
    }

    // ✅ Phone format check (Pakistan)
    const phoneRegex = /^(?:\+92|0)3[0-9]{9}$/;
    if (!phoneRegex.test(phone))
    {
        return NextResponse.json(
            { error: 'Enter a valid Pakistani phone number' },
            { status: 400 }
        );
    }

    // ✅ Email format (if provided)
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

    // ✅ Password length
    if (password.length < 6)
    {
        return NextResponse.json(
            { error: 'Password must be at least 6 characters long' },
            { status: 400 }
        );
    }

    try
    {
        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            ...body,
            password: hashedPassword,
        });

        const { password: _, ...userWithoutPassword } = newUser.toObject();
        void _

        return NextResponse.json(userWithoutPassword, { status: 201 });
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

// PUT /api/users?id=
export async function PUT(req: Request)
{
    const url = new URL(req.url);
    const userId = url.searchParams.get('id');
    console.log(userId, 'printing UserId')

    await dbConnect();

    // ✅ Check for valid ObjectId
    if (!isValidObjectId(userId))
    {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await req.json();
    const { phone, email, password, name, address } = body;

    // ✅ Validate phone
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

    // ✅ Validate email
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

    // ✅ Validate name (optional)
    if (name && name.length < 2)
    {
        return NextResponse.json(
            { error: 'Name must be at least 2 characters' },
            { status: 400 }
        );
    }

    // ✅ Validate address (optional)
    if (address && address.length < 5)
    {
        return NextResponse.json(
            { error: 'Address must be at least 5 characters' },
            { status: 400 }
        );
    }

    // ✅ Hash password if provided
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
        }).select('-password'); // never return password

        if (!updatedUser)
        {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const jwtPayload = {
            id: updatedUser.id.toString(),
            name: updatedUser.name,
            phone: updatedUser.phone,
            email: updatedUser.email,
            address: updatedUser.address,
            role: updatedUser.role,
        };

        console.log(jwtPayload, 'printing user')
        return NextResponse.json(jwtPayload);
    }
    catch (err: unknown)
    {
        if (err instanceof Error)
        {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }

        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
    }
}

