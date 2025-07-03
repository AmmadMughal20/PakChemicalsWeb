import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request)
{
    await dbConnect();

    const rawBody = await req.text();
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
        // email: user.email,
        address: user.address,
        role: user.role,
    };

    const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
        expiresIn: '7d', // short-lived
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: '30d', // long-lived
    });

    // Optional: save refreshToken in DB or Redis
    user.refreshToken = refreshToken;
    await user.save();

    return NextResponse.json({
        message: 'Login successful',
        user: jwtPayload,
        token: accessToken,
        refreshToken,
    });
}
