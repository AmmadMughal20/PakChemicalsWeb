import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request)
{
    await dbConnect();

    // 🧪 Get raw body text
    const rawBody = await req.text();
    console.log(rawBody, 'printing raw body')

    if (!rawBody)
    {
        return NextResponse.json({ error: 'Request body is missing' }, { status: 400 });
    }

    let body: { phone?: string; password?: string };

    try
    {
        body = JSON.parse(rawBody);
    } catch
    {
        return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    const { phone, password } = body;

    // ✅ Validate presence before using fields
    if (!phone || !password)
    {
        return NextResponse.json(
            { error: 'Both phone and password are required' },
            { status: 400 }
        );
    }

    const user = await UserModel.findOne({ phone });
    if (!user)
    {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
    {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const jwtPayload = {
        id: user.id.toString(),
        name: user.name,
        phone: user.phone,
        role: user.role,
    };

    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    });

    return NextResponse.json({
        message: 'Login successful',
        user: jwtPayload,
        token: jwtToken,
    });
}


