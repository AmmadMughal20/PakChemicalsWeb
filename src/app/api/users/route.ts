import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // A helper to connect MongoDB
import UserModel from '@/models/User'; // Your model path
import bcrypt from 'bcryptjs';


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

