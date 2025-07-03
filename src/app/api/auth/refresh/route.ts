// app/api/auth/refresh/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';


interface JwtPayload
{
    id: string;
    iat?: number;
    exp?: number;
}

export async function POST(req: Request)
{
    await dbConnect();

    const body = await req.json();
    const { refreshToken } = body;

    console.log('refreshtoken called')

    if (!refreshToken)
    {
        return NextResponse.json({ error: 'Refresh token missing' }, { status: 400 });
    }

    try
    {
        // ✅ Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;;

        // ✅ Find user by ID
        const user = await UserModel.findById(decoded.id);
        if (!user)
        {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // ✅ Optional: check refresh token matches what's stored (if you're saving it)
        if (user.refreshToken !== refreshToken)
        {
            return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
        }

        // ✅ Issue new access token
        const accessToken = jwt.sign(
            {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                address: user.address,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        // ✅ Optionally: generate a new refresh token
        const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, {
            expiresIn: '30d',
        });

        // Optional: save new refreshToken in DB
        user.refreshToken = newRefreshToken;
        await user.save();

        return NextResponse.json({
            token: accessToken,
            refreshToken: newRefreshToken, // or return old one if not rotating
        });
    }
    catch (error: unknown)
    {
        if (error instanceof jwt.TokenExpiredError)
        {
            return NextResponse.json({ error: 'Refresh token expired' }, { status: 401 });
        }

        if (error instanceof Error)
        {
            console.error(error.message);
        }

        return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }
}
